/* eslint-disable prettier/prettier */
import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name); 
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`[Middleware]  ${req.method} ${req.originalUrl}`);
    next(); 
  }
}