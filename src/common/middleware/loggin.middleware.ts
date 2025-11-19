import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;
        const start = Date.now();

        res.on('finish', () => {
            const ms = Date.now() - start;
            console.log(`[${method}] ${originalUrl} → ${res.statusCode} (${ms}ms)`);
        });

        next();
    }
}
