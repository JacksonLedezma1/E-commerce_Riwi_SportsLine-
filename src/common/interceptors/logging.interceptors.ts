import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const start = Date.now();

        return next.handle().pipe(
            tap(() => {
                const time = Date.now() - start;
                console.log(`Request handled in ${time}ms`);
            })
        )
    }
}