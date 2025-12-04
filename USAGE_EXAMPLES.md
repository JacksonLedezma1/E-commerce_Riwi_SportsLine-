# 📚 Ejemplos de Uso - Middleware, Filtros e Interceptores

## 🎯 Índice

1. [Usando Guards y Decoradores de Roles](#usando-guards-y-decoradores-de-roles)
2. [Ejemplos por Controlador](#ejemplos-por-controlador)
3. [Respuestas Formateadas](#respuestas-formateadas)
4. [Manejo de Errores](#manejo-de-errores)
5. [Logs y Auditoría](#logs-y-auditoría)

---

## Usando Guards y Decoradores de Roles

### Paso 1: Importar el Guard y Decorador

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
```

### Paso 2: Aplicar a Nivel de Controlador

```typescript
@Controller('productos')
@UseGuards(RolesGuard)
export class ProductosController {
    // Todos los métodos requieren validación de roles
}
```

### Paso 3: Especificar Roles en Métodos

```typescript
@Get()
@Roles('user', 'admin')  // Usuarios y administradores
findAll() {
    return this.productosService.findAll();
}

@Post()
@Roles('admin')  // Solo administradores
create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
}

@Delete(':id')
@Roles('admin', 'moderator')  // Administradores y moderadores
delete(@Param('id') id: number) {
    return this.productosService.delete(id);
}
```

---

## Ejemplos por Controlador

### 📦 Controlador de Productos

```typescript
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('productos')
@UseGuards(RolesGuard)
export class ProductosController {
    constructor(private readonly productosService: ProductosService) {}

    // ✅ Accesible para usuarios y administradores
    @Get()
    @Roles('user', 'admin')
    async findAll() {
        return this.productosService.findAll();
    }

    // ✅ Accesible para cualquiera (sin @Roles)
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.productosService.findOne(id);
    }

    // ✅ Solo administradores
    @Post()
    @Roles('admin')
    async create(@Body() createProductoDto: CreateProductoDto) {
        return this.productosService.create(createProductoDto);
    }

    // ✅ Solo administradores
    @Put(':id')
    @Roles('admin')
    async update(
        @Param('id') id: number,
        @Body() updateProductoDto: UpdateProductoDto,
    ) {
        return this.productosService.update(id, updateProductoDto);
    }

    // ✅ Solo administradores
    @Delete(':id')
    @Roles('admin')
    async delete(@Param('id') id: number) {
        return this.productosService.delete(id);
    }

    // ✅ Solo administradores
    @Get('stats/dashboard')
    @Roles('admin')
    async getStats() {
        return this.productosService.getStats();
    }
}
```

### 👥 Controlador de Usuarios

```typescript
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuarios.dto';
import { UpdateUsuarioDto } from './dto/update-usuarios.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('usuarios')
@UseGuards(RolesGuard)
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    // ✅ Público (sin @Roles)
    @Post()
    async crear(@Body() dto: CreateUsuarioDto) {
        return this.usuariosService.crearUsuario(dto);
    }

    // ✅ Solo administradores
    @Get()
    @Roles('admin')
    async obtenerTodos() {
        return this.usuariosService.obtenerUsuarios();
    }

    // ✅ Público (sin @Roles)
    @Get(':id')
    async obtenerPorId(@Param('id') id: number) {
        return this.usuariosService.obtenerUsuarioPorId(id);
    }

    // ✅ Usuarios y administradores
    @Put(':id')
    @Roles('user', 'admin')
    async actualizar(
        @Param('id') id: number,
        @Body() dto: UpdateUsuarioDto,
    ) {
        return this.usuariosService.actualizarUsuario(id, dto);
    }

    // ✅ Solo administradores
    @Delete(':id')
    @Roles('admin')
    async eliminar(@Param('id') id: number) {
        await this.usuariosService.eliminarUsuario(id);
        return { mensaje: `Usuario con id ${id} eliminado correctamente` };
    }
}
```

### 🛒 Controlador de Pedidos

```typescript
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('pedidos')
@UseGuards(RolesGuard)
export class PedidosController {
    constructor(private readonly pedidosService: PedidosService) {}

    // ✅ Usuarios y administradores
    @Post()
    @Roles('user', 'admin')
    async crear(@Body() dto: CreatePedidoDto) {
        return this.pedidosService.crearPedido(dto);
    }

    // ✅ Usuarios y administradores
    @Get()
    @Roles('user', 'admin')
    async obtenerTodos() {
        return this.pedidosService.obtenerPedidos();
    }

    // ✅ Usuarios y administradores
    @Get(':id')
    @Roles('user', 'admin')
    async obtenerPorId(@Param('id') id: number) {
        return this.pedidosService.obtenerPedidoPorId(id);
    }

    // ✅ Solo administradores
    @Put(':id')
    @Roles('admin')
    async actualizar(
        @Param('id') id: number,
        @Body() dto: UpdatePedidoDto,
    ) {
        return this.pedidosService.actualizarPedido(id, dto);
    }

    // ✅ Solo administradores
    @Delete(':id')
    @Roles('admin')
    async eliminar(@Param('id') id: number) {
        await this.pedidosService.eliminarPedido(id);
        return { mensaje: `Pedido con id ${id} eliminado correctamente` };
    }

    // ✅ Solo administradores
    @Get('reportes/ventas')
    @Roles('admin')
    async getReporteVentas() {
        return this.pedidosService.getReporteVentas();
    }
}
```

### 👤 Controlador de Clientes

```typescript
import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('clientes')
@UseGuards(RolesGuard)
export class ClientesController {
    constructor(private readonly clientesService: ClientesService) {}

    // ✅ Público (sin @Roles)
    @Post()
    async crear(@Body() dto: CreateClienteDto) {
        return this.clientesService.crearCliente(dto);
    }

    // ✅ Usuarios y administradores
    @Get()
    @Roles('user', 'admin')
    async obtenerTodos() {
        return this.clientesService.obtenerClientes();
    }

    // ✅ Usuarios y administradores
    @Get(':id')
    @Roles('user', 'admin')
    async obtenerPorId(@Param('id') id: number) {
        return this.clientesService.obtenerClientePorId(id);
    }

    // ✅ Solo administradores
    @Delete(':id')
    @Roles('admin')
    async eliminar(@Param('id') id: number) {
        await this.clientesService.eliminarCliente(id);
        return { mensaje: `Cliente con id ${id} eliminado correctamente` };
    }
}
```

---

## Respuestas Formateadas

### ✅ Respuesta Exitosa

**Petición:**
```
GET /productos
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "GET /productos - Exitoso",
  "data": [
    {
      "id": 1,
      "nombre": "Balón de fútbol",
      "precio": 150000,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "nombre": "Raqueta de tenis",
      "precio": 250000,
      "createdAt": "2024-01-15T10:31:00.000Z"
    }
  ],
  "timestamp": "2024-01-15T10:35:45.123Z"
}
```

### ❌ Respuesta con Error de Validación

**Petición:**
```
POST /productos
Content-Type: application/json

{
  "nombre": "Producto sin precio"
}
```

**Respuesta (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": {
    "message": [
      "precio must be a number"
    ],
    "error": "Bad Request",
    "statusCode": 400
  },
  "timestamp": "2024-01-15T10:36:00.000Z"
}
```

### 🔒 Respuesta con Error de Autorización

**Petición:**
```
POST /productos
Authorization: Bearer token_user
Content-Type: application/json

{
  "nombre": "Producto Nuevo",
  "precio": 99999
}
```

**Respuesta (403 Forbidden):**
```json
{
  "statusCode": 403,
  "message": "Acceso denegado. Se requieren los siguientes roles: admin",
  "timestamp": "2024-01-15T10:36:15.000Z"
}
```

### 🔐 Respuesta sin Autenticación

**Petición:**
```
GET /usuarios
```

**Respuesta (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Usuario no autenticado",
  "timestamp": "2024-01-15T10:36:30.000Z"
}
```

---

## Manejo de Errores

### Excepciones Comunes

```typescript
// UnauthorizedException - Usuario no autenticado
throw new UnauthorizedException('Usuario no autenticado');

// ForbiddenException - Usuario sin permisos
throw new ForbiddenException('Acceso denegado. Se requieren los siguientes roles: admin');

// BadRequestException - Datos inválidos
throw new BadRequestException('El precio debe ser mayor a 0');

// NotFoundException - Recurso no encontrado
throw new NotFoundException('Producto no encontrado');

// ConflictException - Conflicto (ej: email duplicado)
throw new ConflictException('El email ya está registrado');

// InternalServerErrorException - Error interno
throw new InternalServerErrorException('Error al procesar la solicitud');
```

### Ejemplo de Manejo en Servicio

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class ProductosService {
    async findOne(id: number) {
        const producto = await this.productosRepository.findOne({ where: { id } });
        
        if (!producto) {
            throw new NotFoundException(`Producto con id ${id} no encontrado`);
        }
        
        return producto;
    }

    async create(createProductoDto: CreateProductoDto) {
        if (createProductoDto.precio <= 0) {
            throw new BadRequestException('El precio debe ser mayor a 0');
        }
        
        return this.productosRepository.save(createProductoDto);
    }
}
```

---

## Logs y Auditoría

### Logs Generados Automáticamente

#### 1. Middleware de Logging

```
[1234567890-abc123] Incoming → GET /productos | IP: 192.168.1.100 | User-Agent: Mozilla/5.0
[1234567890-abc123] Outgoing → GET /productos | Status: 200 ✅ | Time: 45ms
```

#### 2. Interceptor de Performance

```
[Performance] GET /productos - Execution time: 45ms
[Performance] POST /productos - Execution time: 125ms
```

#### 3. Guard de Roles

```
Usuario 5 con rol "user" intentó acceder a recurso que requiere roles: admin
Usuario 1 con rol "admin" autorizado
```

### Ejemplo de Flujo Completo

**Petición:**
```
POST /productos
Authorization: Bearer token_admin
Content-Type: application/json

{
  "nombre": "Balón Premium",
  "precio": 199999
}
```

**Logs Generados:**
```
[1234567890-def456] Incoming → POST /productos | IP: 192.168.1.100 | User-Agent: Postman/10.0
Usuario 1 con rol "admin" autorizado
[Performance] POST /productos - Execution time: 125ms
[1234567890-def456] Outgoing → POST /productos | Status: 201 ✅ | Time: 125ms
```

**Respuesta:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "POST /productos - Exitoso",
  "data": {
    "id": 3,
    "nombre": "Balón Premium",
    "precio": 199999,
    "createdAt": "2024-01-15T10:40:00.000Z"
  },
  "timestamp": "2024-01-15T10:40:00.123Z"
}
```

---

## 🎓 Resumen de Patrones

### Patrón 1: Endpoint Público

```typescript
@Get(':id')
async findOne(@Param('id') id: number) {
    return this.service.findOne(id);
}
```

### Patrón 2: Endpoint Protegido (Solo Admin)

```typescript
@Post()
@Roles('admin')
async create(@Body() dto: CreateDto) {
    return this.service.create(dto);
}
```

### Patrón 3: Endpoint Protegido (Múltiples Roles)

```typescript
@Put(':id')
@Roles('user', 'admin')
async update(@Param('id') id: number, @Body() dto: UpdateDto) {
    return this.service.update(id, dto);
}
```

### Patrón 4: Endpoint Administrativo

```typescript
@Get('admin/stats')
@Roles('admin')
async getStats() {
    return this.service.getStats();
}
```

---

## ✅ Checklist de Implementación

- [ ] Importar `RolesGuard` y `Roles` en el controlador
- [ ] Aplicar `@UseGuards(RolesGuard)` a nivel de controlador
- [ ] Especificar `@Roles()` en métodos que requieren protección
- [ ] Probar con Postman o Thunder Client
- [ ] Verificar logs en consola
- [ ] Ejecutar pruebas unitarias

---

## 🔗 Recursos

- [Documentación Completa](./src/common/README.md)
- [Guía de Implementación](./IMPLEMENTATION_GUIDE.md)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [NestJS Interceptors](https://docs.nestjs.com/interceptors)
