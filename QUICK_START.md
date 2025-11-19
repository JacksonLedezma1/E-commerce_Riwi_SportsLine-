# ⚡ Quick Start - Middleware, Filtros e Interceptores

## 🎯 Lo que se implementó

✅ **Middleware de Auditoría** - Logging de todas las peticiones  
✅ **Exception Filter Global** - Manejo centralizado de errores  
✅ **Guards de Roles** - Control de acceso basado en roles  
✅ **Interceptors** - Formateo de respuestas y medición de tiempo  
✅ **Pruebas Unitarias** - Cobertura completa de componentes  

---

## 🚀 Cómo Usar

### 1. Proteger un Endpoint

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('productos')
@UseGuards(RolesGuard)
export class ProductosController {
    @Get()
    @Roles('admin')  // ← Solo administradores
    findAll() {
        return this.productosService.findAll();
    }
}
```

### 2. Permitir Múltiples Roles

```typescript
@Post()
@Roles('admin', 'moderator')  // ← Admin o Moderador
create(@Body() dto: CreateProductoDto) {
    return this.productosService.create(dto);
}
```

### 3. Endpoint Público (Sin Protección)

```typescript
@Get(':id')
// Sin @Roles → Accesible para todos
findOne(@Param('id') id: number) {
    return this.productosService.findOne(id);
}
```

---

## 📊 Respuestas Automáticas

### ✅ Éxito (200)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "GET /productos - Exitoso",
  "data": [...],
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### ❌ Error de Autorización (403)

```json
{
  "statusCode": 403,
  "message": "Acceso denegado. Se requieren los siguientes roles: admin",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### ❌ Error de Validación (400)

```json
{
  "statusCode": 400,
  "message": {
    "message": ["precio must be a number"],
    "error": "Bad Request",
    "statusCode": 400
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

---

## 📝 Logs Automáticos

```
[1234567890-abc123] Incoming → GET /productos | IP: 127.0.0.1 | User-Agent: Mozilla/5.0
[Performance] GET /productos - Execution time: 45ms
[1234567890-abc123] Outgoing → GET /productos | Status: 200 ✅ | Time: 45ms
```

---

## 🧪 Ejecutar Pruebas

```bash
# Todas las pruebas
npm run test

# Con cobertura
npm run test:cov

# Modo watch
npm run test:watch

# Prueba específica
npm run test -- roles.guard.spec.ts
```

**Resultado:**
```
Test Suites: 4 passed, 4 total
Tests:       19 passed, 19 total
```

---

## 📁 Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/common/middleware/loggin.middleware.ts` | Logging de peticiones |
| `src/common/guards/roles.guard.ts` | Validación de roles |
| `src/common/decorators/roles.decorator.ts` | Decorador @Roles() |
| `src/common/interceptors/response.interceptor.ts` | Formateo de respuestas |
| `src/common/interceptors/logging.interceptor.ts` | Medición de tiempo |
| `src/common/filters/http-exception.filter.ts` | Manejo de errores |
| `src/main.ts` | Configuración global |

---

## 🔍 Ejemplo Completo

### Controlador

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('productos')
@UseGuards(RolesGuard)
export class ProductosController {
    constructor(private readonly productosService: ProductosService) {}

    @Get()
    @Roles('user', 'admin')
    findAll() {
        return this.productosService.findAll();
    }

    @Post()
    @Roles('admin')
    create(@Body() dto: CreateProductoDto) {
        return this.productosService.create(dto);
    }
}
```

### Petición GET /productos (Usuario: admin)

**Request:**
```
GET /productos
Authorization: Bearer token_admin
```

**Logs:**
```
[1234567890-abc] Incoming → GET /productos | IP: 192.168.1.100
Usuario 1 con rol "admin" autorizado
[Performance] GET /productos - Execution time: 45ms
[1234567890-abc] Outgoing → GET /productos | Status: 200 ✅
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

### Petición POST /productos (Usuario: user)

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
[1234567890-def] Incoming → POST /productos | IP: 192.168.1.100
Usuario 5 con rol "user" intentó acceder a recurso que requiere roles: admin
[1234567890-def] Outgoing → POST /productos | Status: 403 ❌
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

## 📚 Documentación Completa

- **Arquitectura:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Guía de Implementación:** [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- **Ejemplos de Uso:** [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)
- **Componentes Comunes:** [src/common/README.md](./src/common/README.md)

---

## ✅ Checklist de Verificación

- [x] Middleware de logging implementado
- [x] Exception filter global configurado
- [x] Guards de roles funcionales
- [x] Interceptors de respuesta y logging
- [x] Decorador @Roles() disponible
- [x] Pruebas unitarias (19 tests pasando)
- [x] Integración en AppModule
- [x] Documentación completa

---

## 🎓 Patrones Comunes

### Patrón 1: Endpoint Público
```typescript
@Get(':id')
findOne(@Param('id') id: number) { }
```

### Patrón 2: Solo Admin
```typescript
@Post()
@Roles('admin')
create(@Body() dto: CreateDto) { }
```

### Patrón 3: Múltiples Roles
```typescript
@Put(':id')
@Roles('user', 'admin')
update(@Param('id') id: number, @Body() dto: UpdateDto) { }
```

### Patrón 4: Admin Only
```typescript
@Get('admin/stats')
@Roles('admin')
getStats() { }
```

---

## 🔗 Próximos Pasos

1. Implementar autenticación JWT
2. Agregar validación de permisos más granulares
3. Implementar rate limiting
4. Agregar logging a archivos
5. Integrar con servicios de monitoreo

---

## ❓ Preguntas Frecuentes

**P: ¿Cómo agrego un nuevo rol?**  
R: Solo añade el rol en el decorador `@Roles('nuevo-rol')` y asegúrate que el usuario tenga ese rol asignado.

**P: ¿Puedo usar múltiples Guards?**  
R: Sí, puedes combinar `@UseGuards(Guard1, Guard2)` para aplicar múltiples guards.

**P: ¿Dónde se guardan los logs?**  
R: Por defecto en consola. Puedes redirigirlos a archivos configurando el logger de NestJS.

**P: ¿Cómo personalizo el formato de respuesta?**  
R: Modifica `src/common/interceptors/response.interceptor.ts`.

**P: ¿Puedo desactivar un Guard en un endpoint?**  
R: Sí, no uses `@UseGuards()` en ese endpoint específico.

---

## 🆘 Soporte

- Documentación: [src/common/README.md](./src/common/README.md)
- Ejemplos: [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)
- Arquitectura: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**¡Listo para usar! 🚀**
