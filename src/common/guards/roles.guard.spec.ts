import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';

describe('RolesGuard', () => {
    let guard: RolesGuard;
    let reflector: Reflector;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RolesGuard,
                {
                    provide: Reflector,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        guard = module.get<RolesGuard>(RolesGuard);
        reflector = module.get<Reflector>(Reflector);
    });

    it('debe estar definido', () => {
        expect(guard).toBeDefined();
    });

    it('debe permitir acceso cuando no hay roles requeridos', () => {
        jest.spyOn(reflector, 'get').mockReturnValue(undefined);

        const mockExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    user: { id: 1, rol: 'admin' },
                }),
            }),
            getHandler: () => ({}),
        } as unknown as ExecutionContext;

        expect(guard.canActivate(mockExecutionContext)).toBe(true);
    });

    it('debe permitir acceso cuando el usuario tiene el rol requerido', () => {
        jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

        const mockExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    user: { id: 1, rol: 'admin' },
                }),
            }),
            getHandler: () => ({}),
        } as unknown as ExecutionContext;

        expect(guard.canActivate(mockExecutionContext)).toBe(true);
    });

    it('debe lanzar UnauthorizedException cuando no hay usuario', () => {
        jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

        const mockExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    user: null,
                }),
            }),
            getHandler: () => ({}),
        } as unknown as ExecutionContext;

        expect(() => guard.canActivate(mockExecutionContext)).toThrow(
            UnauthorizedException,
        );
    });

    it('debe lanzar ForbiddenException cuando el usuario no tiene rol', () => {
        jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

        const mockExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    user: { id: 1, rol: null },
                }),
            }),
            getHandler: () => ({}),
        } as unknown as ExecutionContext;

        expect(() => guard.canActivate(mockExecutionContext)).toThrow(
            ForbiddenException,
        );
    });

    it('debe lanzar ForbiddenException cuando el usuario no tiene el rol requerido', () => {
        jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

        const mockExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    user: { id: 1, rol: 'user' },
                }),
            }),
            getHandler: () => ({}),
        } as unknown as ExecutionContext;

        expect(() => guard.canActivate(mockExecutionContext)).toThrow(
            ForbiddenException,
        );
    });

    it('debe permitir acceso cuando el usuario tiene uno de los múltiples roles requeridos', () => {
        jest.spyOn(reflector, 'get').mockReturnValue(['admin', 'moderator']);

        const mockExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    user: { id: 1, rol: 'moderator' },
                }),
            }),
            getHandler: () => ({}),
        } as unknown as ExecutionContext;

        expect(guard.canActivate(mockExecutionContext)).toBe(true);
    });
});
