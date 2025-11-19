import { Test, TestingModule } from '@nestjs/testing';
import { ResponseInterceptor } from './response.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('ResponseInterceptor', () => {
    let interceptor: ResponseInterceptor<any>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ResponseInterceptor],
        }).compile();

        interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);
    });

    it('debe estar definido', () => {
        expect(interceptor).toBeDefined();
    });

    it('debe formatear la respuesta correctamente', (done) => {
        const mockData = { id: 1, nombre: 'Test' };

        const mockExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    method: 'GET',
                    originalUrl: '/usuarios',
                }),
                getResponse: () => ({
                    statusCode: 200,
                }),
            }),
            getHandler: () => ({}),
        } as unknown as ExecutionContext;

        const mockCallHandler = {
            handle: () => of(mockData),
        } as unknown as CallHandler;

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(
            (response) => {
                expect(response).toHaveProperty('success', true);
                expect(response).toHaveProperty('statusCode', 200);
                expect(response).toHaveProperty('message');
                expect(response).toHaveProperty('data', mockData);
                expect(response).toHaveProperty('timestamp');
                done();
            },
        );
    });

    it('debe incluir el método y URL en el mensaje', (done) => {
        const mockData = { test: 'data' };

        const mockExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    method: 'POST',
                    originalUrl: '/productos',
                }),
                getResponse: () => ({
                    statusCode: 201,
                }),
            }),
            getHandler: () => ({}),
        } as unknown as ExecutionContext;

        const mockCallHandler = {
            handle: () => of(mockData),
        } as unknown as CallHandler;

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(
            (response) => {
                expect(response.message).toContain('POST');
                expect(response.message).toContain('/productos');
                done();
            },
        );
    });

    it('debe incluir timestamp en formato ISO', (done) => {
        const mockData = {};

        const mockExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    method: 'GET',
                    originalUrl: '/test',
                }),
                getResponse: () => ({
                    statusCode: 200,
                }),
            }),
            getHandler: () => ({}),
        } as unknown as ExecutionContext;

        const mockCallHandler = {
            handle: () => of(mockData),
        } as unknown as CallHandler;

        interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(
            (response) => {
                expect(response.timestamp).toMatch(
                    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
                );
                done();
            },
        );
    });
});
