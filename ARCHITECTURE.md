# 🏗️ Arquitectura - Middleware, Filtros e Interceptores

## 📊 Diagrama del Flujo de Peticiones

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PETICIÓN HTTP ENTRANTE                        │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │   1. LoggingMiddleware                 │
        │   ├─ Genera RequestID                  │
        │   ├─ Registra entrada (IP, UA)        │
        │   └─ Inicia cronómetro                │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │   2. ValidationPipe                    │
        │   ├─ Valida estructura de datos       │
        │   ├─ Transforma tipos                 │
        │   └─ Rechaza datos inválidos          │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │   3. RolesGuard                        │
        │   ├─ Valida autenticación             │
        │   ├─ Verifica rol del usuario         │
        │   └─ Comprueba permisos               │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │   4. LoggingInterceptor (Entrada)      │
        │   └─ Inicia medición de tiempo        │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │   5. CONTROLADOR & SERVICIO            │
        │   ├─ Lógica de negocio                │
        │   ├─ Acceso a base de datos           │
        │   └─ Procesamiento de datos           │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │   6. LoggingInterceptor (Salida)       │
        │   ├─ Calcula tiempo de ejecución      │
        │   └─ Registra en logs                 │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │   7. ResponseInterceptor               │
        │   ├─ Formatea respuesta                │
        │   ├─ Añade metadata                    │
        │   └─ Estructura estándar               │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │   8. GlobalExceptionFilter (si error)  │
        │   ├─ Captura excepciones               │
        │   ├─ Formatea error                    │
        │   └─ Retorna respuesta consistente     │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │   9. LoggingMiddleware (Salida)        │
        │   ├─ Registra código de estado        │
        │   ├─ Calcula tiempo total             │
        │   └─ Genera log de auditoría          │
        └────────────────┬───────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        RESPUESTA HTTP SALIENTE                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Ciclo de Vida Detallado

### Fase 1: Entrada (Request)

```
HTTP Request
    ↓
LoggingMiddleware
├─ Genera: RequestID = "1234567890-abc123"
├─ Registra: [1234567890-abc123] Incoming → GET /productos
├─ Extrae: IP, User-Agent, Headers
└─ Inicia: Cronómetro

    ↓
ValidationPipe
├─ Valida: Estructura del DTO
├─ Transforma: Tipos de datos
└─ Lanza: BadRequestException si falla

    ↓
RolesGuard
├─ Verifica: Usuario autenticado
├─ Comprueba: Rol del usuario
├─ Valida: Permisos requeridos
└─ Lanza: UnauthorizedException o ForbiddenException si falla
```

### Fase 2: Procesamiento (Handler)

```
LoggingInterceptor (Entrada)
├─ Inicia: Cronómetro de ejecución
└─ Registra: Inicio de procesamiento

    ↓
Controlador
├─ Recibe: Datos validados
├─ Llama: Servicio
└─ Retorna: Datos procesados

    ↓
Servicio
├─ Lógica: De negocio
├─ Acceso: Base de datos
└─ Retorna: Resultado
```

### Fase 3: Salida (Response)

```
LoggingInterceptor (Salida)
├─ Calcula: Tiempo de ejecución
├─ Registra: [Performance] GET /productos - Execution time: 45ms
└─ Pasa: Datos al siguiente interceptor

    ↓
ResponseInterceptor
├─ Formatea: Respuesta
├─ Estructura:
│  ├─ success: true
│  ├─ statusCode: 200
│  ├─ message: "GET /productos - Exitoso"
│  ├─ data: {...}
│  └─ timestamp: "2024-01-15T10:30:45.123Z"
└─ Retorna: Respuesta formateada

    ↓
GlobalExceptionFilter (si hay error)
├─ Captura: Excepciones
├─ Formatea: Respuesta de error
└─ Retorna: Error consistente

    ↓
LoggingMiddleware (Salida)
├─ Registra: [1234567890-abc123] Outgoing → GET /productos
├─ Incluye: Status Code (200 ✅ o 4xx/5xx ❌)
├─ Calcula: Tiempo total
└─ Genera: Log de auditoría

    ↓
HTTP Response
```

---

## 📦 Componentes y Responsabilidades

### 1. LoggingMiddleware
```
┌─────────────────────────────────┐
│   LoggingMiddleware             │
├─────────────────────────────────┤
│ Responsabilidades:              │
│ • Generar RequestID único       │
│ • Registrar entrada de petición │
│ • Capturar IP y User-Agent      │
│ • Medir tiempo total            │
│ • Registrar salida de respuesta │
│ • Indicar éxito/error           │
├─────────────────────────────────┤
│ Ubicación: src/common/middleware│
│ Alcance: Global (todas las      │
│          rutas)                 │
└─────────────────────────────────┘
```

### 2. ValidationPipe
```
┌─────────────────────────────────┐
│   ValidationPipe                │
├─────────────────────────────────┤
│ Responsabilidades:              │
│ • Validar estructura de DTO     │
│ • Transformar tipos de datos    │
│ • Eliminar propiedades extras   │
│ • Lanzar excepciones            │
├─────────────────────────────────┤
│ Ubicación: main.ts              │
│ Alcance: Global (todas las      │
│          rutas)                 │
└─────────────────────────────────┘
```

### 3. RolesGuard
```
┌─────────────────────────────────┐
│   RolesGuard                    │
├─────────────────────────────────┤
│ Responsabilidades:              │
│ • Validar autenticación         │
│ • Verificar rol del usuario     │
│ • Validar permisos              │
│ • Registrar intentos fallidos   │
│ • Lanzar excepciones            │
├─────────────────────────────────┤
│ Ubicación: src/common/guards    │
│ Alcance: Selectivo (@UseGuards) │
└─────────────────────────────────┘
```

### 4. LoggingInterceptor
```
┌─────────────────────────────────┐
│   LoggingInterceptor            │
├─────────────────────────────────┤
│ Responsabilidades:              │
│ • Medir tiempo de ejecución     │
│ • Registrar en logs             │
│ • Identificar cuellos botella   │
├─────────────────────────────────┤
│ Ubicación: src/common/          │
│            interceptors         │
│ Alcance: Global (todas las      │
│          rutas)                 │
└─────────────────────────────────┘
```

### 5. ResponseInterceptor
```
┌─────────────────────────────────┐
│   ResponseInterceptor           │
├─────────────────────────────────┤
│ Responsabilidades:              │
│ • Formatear respuestas          │
│ • Añadir metadata               │
│ • Estructura estándar           │
│ • Incluir timestamp             │
├─────────────────────────────────┤
│ Ubicación: src/common/          │
│            interceptors         │
│ Alcance: Global (todas las      │
│          rutas)                 │
└─────────────────────────────────┘
```

### 6. GlobalExceptionFilter
```
┌─────────────────────────────────┐
│   GlobalExceptionFilter         │
├─────────────────────────────────┤
│ Responsabilidades:              │
│ • Capturar excepciones          │
│ • Formatear errores             │
│ • Estructura consistente        │
│ • Incluir timestamp             │
├─────────────────────────────────┤
│ Ubicación: src/common/filters   │
│ Alcance: Global (todas las      │
│          rutas)                 │
└─────────────────────────────────┘
```

---

## 🎯 Matriz de Decisión

| Componente | Cuándo Usar | Ejemplo |
|-----------|-----------|---------|
| **Middleware** | Lógica que aplica a todas las peticiones | Logging, CORS, compresión |
| **Pipe** | Validación y transformación de datos | Validar DTO, convertir tipos |
| **Guard** | Control de acceso y autorización | Validar roles, permisos |
| **Interceptor** | Transformar request/response | Formatear respuestas, logging |
| **Filter** | Manejo centralizado de errores | Capturar excepciones |

---

## 📈 Orden de Ejecución

```
1. Middleware (Entrada)
   ↓
2. Pipe (Validación)
   ↓
3. Guard (Autorización)
   ↓
4. Interceptor (Entrada)
   ↓
5. Controlador & Servicio
   ↓
6. Interceptor (Salida)
   ↓
7. Filter (si hay error)
   ↓
8. Middleware (Salida)
```

---

## 🔐 Niveles de Seguridad

```
┌─────────────────────────────────────────────┐
│ Nivel 1: Validación de Datos (ValidationPipe)
│ └─ Rechaza datos malformados
├─────────────────────────────────────────────┤
│ Nivel 2: Autenticación (RolesGuard)
│ └─ Verifica que el usuario existe
├─────────────────────────────────────────────┤
│ Nivel 3: Autorización (RolesGuard)
│ └─ Verifica que el usuario tiene permisos
├─────────────────────────────────────────────┤
│ Nivel 4: Lógica de Negocio (Servicio)
│ └─ Validaciones adicionales
├─────────────────────────────────────────────┤
│ Nivel 5: Auditoría (Middleware + Logging)
│ └─ Registra todas las acciones
└─────────────────────────────────────────────┘
```

---

## 📊 Ejemplo de Ejecución Completa

### Petición Exitosa

```
GET /productos (Usuario: admin)
    │
    ├─ LoggingMiddleware: Registra entrada
    │  └─ [1234567890-abc] Incoming → GET /productos
    │
    ├─ ValidationPipe: Valida (sin body, OK)
    │
    ├─ RolesGuard: Valida roles
    │  └─ Usuario admin tiene acceso ✅
    │
    ├─ LoggingInterceptor: Inicia medición
    │
    ├─ Controlador: Procesa
    │  └─ productosService.findAll()
    │
    ├─ LoggingInterceptor: Registra tiempo
    │  └─ [Performance] GET /productos - Execution time: 45ms
    │
    ├─ ResponseInterceptor: Formatea
    │  └─ { success: true, data: [...], timestamp: ... }
    │
    └─ LoggingMiddleware: Registra salida
       └─ [1234567890-abc] Outgoing → GET /productos | Status: 200 ✅
```

### Petición con Error de Autorización

```
POST /productos (Usuario: user)
    │
    ├─ LoggingMiddleware: Registra entrada
    │  └─ [1234567890-def] Incoming → POST /productos
    │
    ├─ ValidationPipe: Valida body (OK)
    │
    ├─ RolesGuard: Valida roles
    │  └─ Usuario user NO tiene acceso ❌
    │  └─ Lanza: ForbiddenException
    │
    ├─ GlobalExceptionFilter: Captura error
    │  └─ Formatea respuesta de error
    │
    └─ LoggingMiddleware: Registra salida
       └─ [1234567890-def] Outgoing → POST /productos | Status: 403 ❌
```

---

## 🧪 Cobertura de Pruebas

```
┌──────────────────────────────────────────┐
│ Componente          │ Pruebas Unitarias  │
├──────────────────────────────────────────┤
│ LoggingMiddleware   │ ✅ 3 pruebas       │
│ RolesGuard          │ ✅ 7 pruebas       │
│ ResponseInterceptor │ ✅ 4 pruebas       │
│ LoggingInterceptor  │ ✅ 3 pruebas       │
├──────────────────────────────────────────┤
│ TOTAL               │ ✅ 17 pruebas      │
└──────────────────────────────────────────┘
```

---

## 📁 Estructura de Archivos

```
src/
├── common/
│   ├── decorators/
│   │   └── roles.decorator.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   │   ├── roles.guard.ts
│   │   └── roles.guard.spec.ts
│   ├── interceptors/
│   │   ├── response.interceptor.ts
│   │   ├── response.interceptor.spec.ts
│   │   ├── logging.interceptor.ts
│   │   └── logging.interceptor.spec.ts
│   ├── middleware/
│   │   ├── loggin.middleware.ts
│   │   └── loggin.middleware.spec.ts
│   └── README.md
├── Clientes/
├── Pedidos/
├── Productos/
├── Usuarios/
├── Seeds/
├── config/
│   └── DataBase.ts
└── main.ts
```

---

## 🔗 Integración con Módulos

```
AppModule
├── Imports:
│   ├── ConfigModule
│   ├── TypeOrmModule
│   ├── UsuariosModule
│   ├── ProductosModule
│   ├── PedidosModule
│   └── ClientesModule
│
├── Middleware:
│   └── LoggingMiddleware (forRoutes: '*')
│
└── main.ts:
    ├── ValidationPipe (global)
    ├── Interceptors (global):
    │   ├── LoggingInterceptor
    │   └── ResponseInterceptor
    └── Filters (global):
        └── GlobalExceptionFilter
```

---

## ✨ Beneficios de la Arquitectura

| Beneficio | Descripción |
|-----------|-------------|
| **Seguridad** | Múltiples niveles de validación y autorización |
| **Auditoría** | Registro completo de todas las operaciones |
| **Consistencia** | Respuestas y errores formateados uniformemente |
| **Performance** | Medición y monitoreo de tiempos |
| **Mantenibilidad** | Código limpio y separación de responsabilidades |
| **Testabilidad** | Componentes desacoplados y fáciles de probar |
| **Escalabilidad** | Fácil agregar nuevos guards, interceptores, etc. |

---

## 🚀 Próximas Mejoras

1. **Autenticación JWT** - Implementar autenticación basada en tokens
2. **Rate Limiting** - Limitar número de peticiones por IP/usuario
3. **Logging a Archivos** - Guardar logs en archivos en lugar de consola
4. **Auditoría en BD** - Registrar cambios en base de datos
5. **Compresión** - Comprimir respuestas HTTP
6. **CORS Avanzado** - Configuración más granular de CORS
7. **Métricas** - Integración con Prometheus/Grafana
8. **Tracing** - Rastreo distribuido de peticiones
