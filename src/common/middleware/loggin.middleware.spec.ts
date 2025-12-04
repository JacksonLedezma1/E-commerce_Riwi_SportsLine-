import { Test, TestingModule } from '@nestjs/testing';
import { LoggingMiddleware } from './loggin.middleware';
import { Request, Response, NextFunction } from 'express';

describe('LoggingMiddleware', () => {
    let middleware: LoggingMiddleware;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(async () => {
        middleware = new LoggingMiddleware();

        mockRequest = {
            method: 'GET',
            originalUrl: '/usuarios',
            ip: '127.0.0.1',
            headers: {
                'user-agent': 'Mozilla/5.0',
            },
        };

        mockResponse = {
            statusCode: 200,
            on: jest.fn((event: string, callback: Function) => {
                if (event === 'finish') {
                    callback();
                }
                return mockResponse as any;
            }),
        };

        mockNext = jest.fn();
    });

    it('debe estar definido', () => {
        expect(middleware).toBeDefined();
    });

    it('debe llamar a next()', () => {
        middleware.use(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe registrar eventos de entrada y salida', () => {
        const loggerSpy = jest.spyOn(middleware['logger'], 'log');

        middleware.use(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );

        expect(loggerSpy).toHaveBeenCalledTimes(2);
        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining('Incoming'),
        );
        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining('Outgoing'),
        );
    });

    it('debe generar un requestId único', () => {
        const id1 = middleware['generateRequestId']();
        const id2 = middleware['generateRequestId']();

        expect(id1).not.toBe(id2);
        expect(id1).toMatch(/^\d+-[a-z0-9]+$/);
    });
});
