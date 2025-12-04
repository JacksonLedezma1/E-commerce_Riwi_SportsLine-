import { Test, TestingModule } from '@nestjs/testing';
import { LoggingInterceptor } from './logging.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('LoggingInterceptor', () => {
    let interceptor: LoggingInterceptor;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LoggingInterceptor],
        }).compile();

        interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);
    });

    it('debe estar definido', () => {
        expect(interceptor).toBeDefined();
    });

    it('debe registrar el tiempo de ejecución', (done) => {
        const debugSpy = jest.spyOn(interceptor['logger'], 'debug');

        const mockExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    method: 'GET',
                    originalUrl: '/usuarios',
                }),
            }),
            getHandler: () => ({}),
        } as unknown as ExecutionContext;

        const mockCallHandler = {
            handle: () => of({ data: 'test' }),
        } as unknown as CallHandler;

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(
            () => {
                expect(debugSpy).toHaveBeenCalled();
                const callArgs = debugSpy.mock.calls[0][0];
                expect(callArgs).toContain('GET');
                expect(callArgs).toContain('/usuarios');
                expect(callArgs).toContain('Execution time');
                done();
            },
        );
    });

    it('debe incluir la duración en milisegundos', (done) => {
        const debugSpy = jest.spyOn(interceptor['logger'], 'debug');

        const mockExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    method: 'POST',
                    originalUrl: '/productos',
                }),
            }),
            getHandler: () => ({}),
        } as unknown as ExecutionContext;

        const mockCallHandler = {
            handle: () => of({ id: 1 }),
        } as unknown as CallHandler;

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(
            () => {
                expect(debugSpy).toHaveBeenCalled();
                const callArgs = debugSpy.mock.calls[0][0];
                expect(callArgs).toMatch(/\d+ms/);
                done();
            },
        );
    });

    it('debe ejecutar el handler y pasar los datos', (done) => {
        const mockData = { id: 1, nombre: 'Test' };

        const mockExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    method: 'GET',
                    originalUrl: '/test',
                }),
            }),
            getHandler: () => ({}),
        } as unknown as ExecutionContext;

        const mockCallHandler = {
            handle: () => of(mockData),
        } as unknown as CallHandler;

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(
            (data) => {
                expect(data).toEqual(mockData);
                done();
            },
        );
    });
});
