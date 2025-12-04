# 📋 Guía de Implementación - Semana 4: Middleware, Filtros e Interceptores

## ✅ Tareas Completadas

### 1. ✅ Middleware Global de Auditoría
**Archivo:** `src/common/middleware/loggin.middleware.ts`

**Características implementadas:**
- Logging de peticiones entrantes y salientes
- Generación de ID único para cada petición
- Registro de IP, User-Agent y tiempo de ejecución
- Indicador visual de éxito/error (✅/❌)

**Ejemplo de salida:**
```
[1234567890-abc123] Incoming → GET /usuarios | IP: 127.0.0.1 | User-Agent: Mozilla/5.0
[1234567890-abc123] Outgoing → GET /usuarios | Status: 200 ✅ | Time: 45ms
```

---

### 2. ✅ ExceptionFilter Global
**Archivo:** `src/common/filters/http-exception.filter.ts`

**Características implementadas:**
- Captura de todas las excepciones HTTP
- Formato consistente de respuestas de error
- Inclusión de timestamp y código de estado

**Ejemplo de respuesta:**
```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

---

### 3. ✅ Guards Personalizados para Roles
**Archivo:** `src/common/guards/roles.guard.ts`

**Características implementadas:**
- Validación de autenticación del usuario
- Verificación de roles asignados
- Logging detallado de intentos de acceso
- Excepciones específicas (UnauthorizedException, ForbiddenException)

**Uso:**
```typescript
@Controller('usuarios')
@UseGuards(RolesGuard)
export class UsuariosController {
    @Get()
    @Roles('admin')
    findAll() {
        return this.usuariosService.findAll();
    }
}
```

---

### 4. ✅ Interceptors Personalizados

#### 4.1 Response Interceptor
**Archivo:** `src/common/interceptors/response.interceptor.ts`

**Características:**
- Formateo consistente de respuestas exitosas
- Estructura estándar con success, statusCode, message, data, timestamp
- Automático en todas las rutas

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "GET /usuarios - Exitoso",
  "data": [
    { "id": 1, "nombre": "Carlos" }
  ],
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

#### 4.2 Logging Interceptor
**Archivo:** `src/common/interceptors/logging.interceptor.ts`

**Características:**
- Medición de tiempo de ejecución
- Logging en nivel DEBUG
- Identificación de cuellos de botella

**Ejemplo de salida:**
```
[Performance] GET /usuarios - Execution time: 125ms
[Performance] POST /productos - Execution time: 45ms
```

---

### 5. ✅ Pruebas Unitarias

**Archivos de prueba creados:**
- `src/common/middleware/loggin.middleware.spec.ts` ✅
- `src/common/guards/roles.guard.spec.ts` ✅
- `src/common/interceptors/response.interceptor.spec.ts` ✅
- `src/common/interceptors/logging.interceptor.spec.ts` ✅

**Cobertura de pruebas:**
- Middleware: Validación de logging, generación de IDs
- Guards: Autorización, validación de roles, excepciones
- Interceptors: Formateo de respuestas, medición de tiempo

**Ejecutar pruebas:**
```bash
npm run test
npm run test:cov  # Con cobertura
```

---

### 6. ✅ Integración en AppModule

**Archivo:** `src/main.ts`

**Cambios realizados:**
- Importación de interceptores globales
- Registro de `LoggingInterceptor` y `ResponseInterceptor`
- Orden correcto de ejecución

**Configuración:**
```typescript
app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
);
```

---

## 📊 Flujo Completo de una Petición

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

## 🚀 Ejemplo de Uso Completo

### Controlador con Guards y Decoradores

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

### Petición Exitosa (GET /productos)

**Request:**
```
GET /productos
Authorization: Bearer token_admin
```

**Logs:**
```
[1234567890-abc123] Incoming → GET /productos | IP: 192.168.1.100 | User-Agent: Postman/10.0
[Performance] GET /productos - Execution time: 45ms
[1234567890-abc123] Outgoing → GET /productos | Status: 200 ✅ | Time: 45ms
```

**Response:**
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

### Petición con Error de Autorización (POST /productos sin rol admin)

**Request:**
```
POST /productos
Authorization: Bearer token_user
Content-Type: application/json

{
  "nombre": "Producto Nuevo",
  "precio": 99999
}
```

**Logs:**
```
[1234567890-def456] Incoming → POST /productos | IP: 192.168.1.100 | User-Agent: Postman/10.0
Usuario 5 con rol "user" intentó acceder a recurso que requiere roles: admin
[1234567890-def456] Outgoing → POST /productos | Status: 403 ❌ | Time: 12ms
```

**Response:**
```json
{
  "statusCode": 403,
  "message": "Acceso denegado. Se requieren los siguientes roles: admin",
  "timestamp": "2024-01-15T10:30:46.456Z"
}
```

---

## 📁 Estructura Final

```
src/
├── common/
│   ├── decorators/
│   │   ├── roles.decorator.ts
│   │   └── roles.decorator.spec.ts (implícito en roles.guard.spec.ts)
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   │   ├── roles.guard.ts
│   │   └── roles.guard.spec.ts ✅
│   ├── interceptors/
│   │   ├── response.interceptor.ts
│   │   ├── response.interceptor.spec.ts ✅
│   │   ├── logging.interceptor.ts
│   │   └── logging.interceptor.spec.ts ✅
│   ├── middleware/
│   │   ├── loggin.middleware.ts
│   │   └── loggin.middleware.spec.ts ✅
│   └── README.md ✅
├── Clientes/
├── Pedidos/
├── Productos/
├── Usuarios/
├── Seeds/
├── config/
│   └── DataBase.ts
└── main.ts ✅
```

---

## 🧪 Verificación de Pruebas

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar pruebas con cobertura
npm run test:cov

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas de un archivo específico
npm run test -- loggin.middleware.spec.ts
```

---

## 📝 Notas Importantes

1. **Orden de Interceptores:** El orden es importante. `LoggingInterceptor` se ejecuta primero (mide tiempo), luego `ResponseInterceptor` (formatea respuesta).

2. **Guards y Decoradores:** Siempre usar `@UseGuards(RolesGuard)` junto con `@Roles()` para validar permisos.

3. **Middleware vs Interceptor:**
   - Middleware: Se ejecuta antes de llegar al controlador
   - Interceptor: Se ejecuta alrededor del controlador

4. **Logging:** Los logs se pueden redirigir a archivos o servicios externos en producción.

5. **Validación:** El `ValidationPipe` se ejecuta antes que el Guard, por lo que los datos ya están validados.

---

## 🔗 Documentación Adicional

- Documentación completa en: `src/common/README.md`
- Ejemplos de uso en controladores existentes: `src/Usuarios/usuario.controller.ts`

---

## ✨ Criterios de Aceptación - COMPLETADOS

- ✅ Implementación de middleware de logging y validación
- ✅ Uso de ExceptionFilter global
- ✅ Guards personalizados para roles
- ✅ Interceptors para formateo de respuestas y manejo de tiempo
- ✅ Integración de pruebas unitarias

---

## 🎯 Próximos Pasos (Opcional)

1. Implementar autenticación JWT
2. Agregar logging a archivos
3. Implementar rate limiting
4. Agregar validación de permisos más granulares
5. Implementar auditoría en base de datos
