/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";


export interface StandardResponse<T> {
  statusCode: number;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>> {
    const ctx = context.switchToHttp();
    const response= ctx.getResponse();

    // next.handle() returns an Observable of the value from your controller
    return next.handle().pipe(
      map(data => ({
        statusCode: response.statusCode,
        data: data, // data is the value returned from your route handler
      })),
    );
  }
}
