import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        const request = context.switchToHttp().getRequest();
        const { method, originalUrl } = request;

        return next.handle().pipe(
            map((data) => ({
                success: true,
                statusCode: context.switchToHttp().getResponse().statusCode,
                message: `${method} ${originalUrl} - Exitoso`,
                data,
                timestamp: new Date().toISOString(),
            })),
        );
    }
}
