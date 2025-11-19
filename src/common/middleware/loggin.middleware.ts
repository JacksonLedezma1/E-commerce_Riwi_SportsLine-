import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, ip, headers } = req;
        const userAgent = headers['user-agent'];
        const start = Date.now();
        const requestId = this.generateRequestId();

        // Log de entrada
        this.logger.log(
            `[${requestId}] Incoming → ${method} ${originalUrl} | IP: ${ip} | User-Agent: ${userAgent}`,
        );

        res.on('finish', () => {
            const ms = Date.now() - start;
            const statusCode = res.statusCode;
            const statusMessage = statusCode >= 400 ? '❌' : '✅';

            this.logger.log(
                `[${requestId}] Outgoing → ${method} ${originalUrl} | Status: ${statusCode} ${statusMessage} | Time: ${ms}ms`,
            );
        });

        next();
    }

    private generateRequestId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
