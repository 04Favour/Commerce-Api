/* eslint-disable prettier/prettier */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch() // <-- Using @Catch() with no arguments catches ALL exceptions.
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine the status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Determine the message
    const message =
      exception instanceof HttpException
        ? exception.getResponse() // This might be an object or a string
        : 'The server is broken';

    // In production, you would not want to log the stack trace to the console
    // but you WOULD want to send it to a logging service.
    this.logger.error('An unhandled exception occurred:', exception, 'ExceptionFilter');

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: (message as any).message || message, // Handle both string and { message: ... }
    });
  }
}