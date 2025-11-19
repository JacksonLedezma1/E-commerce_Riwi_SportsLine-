# 🔐 Componentes Comunes (Middleware, Filters, Guards, Interceptors)

Este directorio contiene los componentes transversales de la aplicación para mejorar la robustez y control del flujo de peticiones.

## 📁 Estructura

```
common/
├── decorators/
│   └── roles.decorator.ts       # Decorador para asignar roles requeridos
├── filters/
│   └── http-exception.filter.ts # Filtro global de excepciones HTTP
├── guards/
│   └── roles.guard.ts           # Guard para validar roles y permisos
├── interceptors/
│   ├── response.interceptor.ts  # Interceptor para formatear respuestas
│   └── logging.interceptor.ts   # Interceptor para logging de tiempo
├── middleware/
│   └── loggin.middleware.ts     # Middleware de auditoría y logging
└── README.md                    # Este archivo
```

## 🔧 Componentes

### 1. Middleware de Logging y Auditoría (`middleware/loggin.middleware.ts`)

**Propósito:** Registrar todas las peticiones HTTP con información detallada.

**Características:**
- Genera ID único para cada petición
- Registra método, URL, IP y User-Agent
- Mide tiempo de ejecución
- Indica si la respuesta fue exitosa o con error

**Uso:** Se aplica automáticamente a todas las rutas en `AppModule`.

```typescript
// En AppModule
configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
}
```

**Salida de ejemplo:**
```
[1234567890-abc123] Incoming → GET /usuarios | IP: 127.0.0.1 | User-Agent: Mozilla/5.0
[1234567890-abc123] Outgoing → GET /usuarios | Status: 200 ✅ | Time: 45ms
```

---

### 2. Exception Filter Global (`filters/http-exception.filter.ts`)

**Propósito:** Capturar y formatear todas las excepciones HTTP de forma consistente.

**Características:**
- Captura todas las excepciones HTTP
- Formatea respuestas de error de manera uniforme
- Incluye timestamp y código de estado

**Respuesta de error:**
```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

**Uso:** Se aplica automáticamente en `main.ts`.

```typescript
app.useGlobalFilters(new GlobalExceptionFilter());
```

---

### 3. Guard de Roles (`guards/roles.guard.ts`)

**Propósito:** Validar que el usuario autenticado tiene los roles requeridos.

**Características:**
- Valida autenticación del usuario
- Verifica que el usuario tiene un rol asignado
- Comprueba que el rol está en la lista de roles permitidos
- Registra intentos de acceso denegado

**Uso en controladores:**

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('usuarios')
@UseGuards(RolesGuard)
export class UsuariosController {
    @Get()
    @Roles('admin', 'moderator')
    findAll() {
        return 'Solo admin y moderator pueden acceder';
    }

    @Get('perfil')
    @Roles('user', 'admin')
    getPerfil() {
        return 'Usuario y admin pueden acceder';
    }
}
```

**Excepciones lanzadas:**
- `UnauthorizedException`: Usuario no autenticado
- `ForbiddenException`: Usuario sin rol o rol insuficiente

---

### 4. Decorador de Roles (`decorators/roles.decorator.ts`)

**Propósito:** Marcar métodos que requieren roles específicos.

**Uso:**

```typescript
@Roles('admin')
@Get('admin-only')
adminOnly() {
    return 'Solo administradores';
}

@Roles('admin', 'moderator', 'user')
@Get('public')
publicRoute() {
    return 'Accesible para varios roles';
}
```

---

### 5. Interceptor de Formateo de Respuestas (`interceptors/response.interceptor.ts`)

**Propósito:** Formatear todas las respuestas exitosas de forma consistente.

**Características:**
- Envuelve datos en estructura estándar
- Incluye flag de éxito
- Incluye código de estado HTTP
- Incluye timestamp ISO

**Respuesta formateada:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "GET /usuarios - Exitoso",
  "data": [
    { "id": 1, "nombre": "Carlos" },
    { "id": 2, "nombre": "María" }
  ],
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

**Uso:** Se aplica automáticamente en `main.ts`.

```typescript
app.useGlobalInterceptors(new ResponseInterceptor());
```

---

### 6. Interceptor de Logging de Tiempo (`interceptors/logging.interceptor.ts`)

**Propósito:** Medir y registrar el tiempo de ejecución de cada petición.

**Características:**
- Mide tiempo desde que llega la petición hasta que se envía la respuesta
- Registra en nivel DEBUG
- Útil para identificar cuellos de botella

**Salida de ejemplo:**
```
[Performance] GET /usuarios - Execution time: 125ms
[Performance] POST /productos - Execution time: 45ms
```

**Uso:** Se aplica automáticamente en `main.ts`.

```typescript
app.useGlobalInterceptors(new LoggingInterceptor());
```

---

## 📊 Flujo de una Petición

```
1. Petición HTTP llega
   ↓
2. LoggingMiddleware registra entrada
   ↓
3. ValidationPipe valida datos
   ↓
4. RolesGuard valida roles (si aplica)
   ↓
5. LoggingInterceptor inicia medición
   ↓
6. Controlador procesa la petición
   ↓
7. ResponseInterceptor formatea respuesta
   ↓
8. LoggingInterceptor registra tiempo
   ↓
9. LoggingMiddleware registra salida
   ↓
10. Respuesta HTTP se envía
```

---

## ✅ Pruebas Unitarias

Cada componente incluye pruebas unitarias:

- `middleware/loggin.middleware.spec.ts`
- `guards/roles.guard.spec.ts`
- `interceptors/response.interceptor.spec.ts`
- `interceptors/logging.interceptor.spec.ts`

**Ejecutar pruebas:**
```bash
npm run test
npm run test:cov  # Con cobertura
```

---

## 🚀 Ejemplo Completo

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('productos')
@UseGuards(RolesGuard)
export class ProductosController {
    @Get()
    @Roles('user', 'admin')
    findAll() {
        return [
            { id: 1, nombre: 'Balón', precio: 150000 },
            { id: 2, nombre: 'Raqueta', precio: 250000 },
        ];
    }

    @Post()
    @Roles('admin')
    create(@Body() createProductoDto: any) {
        return { id: 3, ...createProductoDto };
    }

    @Get('admin-stats')
    @Roles('admin')
    getStats() {
        return { totalProductos: 100, totalVentas: 5000000 };
    }
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "GET /productos - Exitoso",
  "data": [
    { "id": 1, "nombre": "Balón", "precio": 150000 },
    { "id": 2, "nombre": "Raqueta", "precio": 250000 }
  ],
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

**Respuesta con error (sin rol):**
```json
{
  "statusCode": 403,
  "message": "Acceso denegado. Se requieren los siguientes roles: admin",
  "timestamp": "2024-01-15T10:30:46.456Z"
}
```

---

## 📝 Notas Importantes

1. **Orden de interceptores:** El orden importa. `LoggingInterceptor` se ejecuta primero (mide tiempo), luego `ResponseInterceptor` (formatea respuesta).

2. **Guards y Decoradores:** Siempre usar `@UseGuards(RolesGuard)` junto con `@Roles()` para validar permisos.

3. **Middleware vs Interceptor:** 
   - Middleware: Se ejecuta antes de llegar al controlador
   - Interceptor: Se ejecuta alrededor del controlador

4. **Logging:** Los logs se pueden redirigir a archivos o servicios externos en producción.

---

## 🔗 Referencias

- [NestJS Middleware](https://docs.nestjs.com/middleware)
- [NestJS Exception Filters](https://docs.nestjs.com/exception-filters)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [NestJS Interceptors](https://docs.nestjs.com/interceptors)
- [NestJS Pipes](https://docs.nestjs.com/pipes)
