# 🏀 RIWI SportsLine - API Backend

Sistema de e-commerce deportivo construido con NestJS, TypeORM y PostgreSQL.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Documentación Swagger](#-documentación-swagger)
- [Autenticación](#-autenticación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)

---

## ✨ Características

- 🔐 **Sistema de Autenticación Avanzado**
  - API Keys con scopes y permisos granulares
  - OAuth2 con Google (Login con terceros)
  - Control de acceso basado en roles (Admin/User)

- 📦 **Gestión Completa de E-commerce**
  - Usuarios y perfiles
  - Catálogo de productos deportivos
  - Gestión de clientes
  - Sistema de pedidos

- 🛡️ **Seguridad y Middleware**
  - Guards personalizados
  - Exception filters globales
  - Interceptors para logging y formateo
  - Validación de datos con class-validator

- 📚 **Documentación Interactiva**
  - Swagger/OpenAPI integrado
  - Ejemplos de uso para cada endpoint
  - Pruebas en vivo desde el navegador

---

## 🚀 Tech Stack

- **Framework**: NestJS 11.x
- **Lenguaje**: TypeScript 5.x
- **ORM**: TypeORM 0.3.x
- **Base de Datos**: PostgreSQL 13+
- **Autenticación**: Passport.js (OAuth2, API Keys)
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI

---

## 📦 Instalación

### Requisitos Previos

- Node.js 18+ y npm 9+
- PostgreSQL 13+ instalado y corriendo
- (Opcional) NestJS CLI: `npm i -g @nestjs/cli`

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-repositorio>
   cd E-commerce_Riwi_SportsLine-
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto (ver [Configuración](#-configuración))

4. **Crear la base de datos**
   ```bash
   # Conectar a PostgreSQL
   psql -U postgres
   
   # Crear base de datos
   CREATE DATABASE riwi_sportsline;
   
   # Salir
   \q
   ```

5. **Iniciar el servidor**
   ```bash
   npm run start:dev
   ```

El servidor estará disponible en: **http://localhost:5000**

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz con la siguiente configuración:

```env
# Puerto del servidor
PORT=5000

# Configuración de PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASS=tu_contraseña_aqui
DATABASE_NAME=riwi_sportsline

# OAuth2 Google (Opcional - para login con Google)
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

> ⚠️ **Nota sobre OAuth**: Si no configuras las credenciales de Google, el sistema funcionará sin problemas pero el login con Google no estará disponible.

### Obtener Credenciales de Google OAuth (Opcional)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita Google+ API
4. Crea credenciales OAuth 2.0
5. Agrega la URI de redirección: `http://localhost:5000/auth/google/callback`
6. Copia el Client ID y Client Secret al `.env`

---

## 🎯 Uso

### Iniciar el Servidor en Desarrollo

```bash
npm run start:dev
```

El servidor se recargará automáticamente al detectar cambios.

### Compilar para Producción

```bash
npm run build
npm run start:prod
```

### Acceder a la Documentación

Una vez iniciado el servidor, accede a:

- **API Swagger**: [http://localhost:5000/api](http://localhost:5000/api)
- **Backend**: [http://localhost:5000](http://localhost:5000)

---

## 📡 API Endpoints

### Resumen de Endpoints

| Módulo | Ruta Base | Descripción |
|--------|-----------|-------------|
| Autenticación | `/auth` | API Keys, OAuth, perfil |
| Usuarios | `/usuarios` | CRUD de usuarios |
| Productos | `/Producto` | Catálogo de productos |
| Clientes | `/clientes` | Gestión de clientes |
| Pedidos | `/pedidos` | Sistema de pedidos |

### Ejemplos de Uso

#### 👤 Crear Usuario

```bash
POST /usuarios
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "contrasena": "123456",
  "rol": "admin"
}
```

#### 🏀 Crear Producto

```bash
POST /Producto
Content-Type: application/json

{
  "nombre": "Balón de Fútbol",
  "precio": 150000
}
```

#### 👥 Crear Cliente

```bash
POST /clientes
Content-Type: application/json

{
  "nombre": "María López",
  "direccion": "Calle 45 #23-10"
}
```

#### 📦 Crear Pedido

```bash
POST /pedidos
Content-Type: application/json

{
  "usuarioId": 1,
  "clienteId": 1,
  "productosIds": [1, 2],
  "estado": "pendiente"
}
```

> 💡 **Para más ejemplos y pruebas interactivas**, usa la [documentación Swagger](#-documentación-swagger)

---

## 📚 Documentación Swagger

### Acceso a Swagger UI

Visita **[http://localhost:5000/api](http://localhost:5000/api)** para acceder a la documentación interactiva completa.

### Características de Swagger

- ✅ **Try it Out**: Prueba endpoints directamente desde el navegador
- ✅ **Esquemas de Seguridad**: Autenticación con API Keys
- ✅ **Ejemplos de Respuesta**: Ver respuestas simuladas
- ✅ **Validación en Vivo**: Validar requests antes de enviarlos
- ✅ **Filtros y Búsqueda**: Encuentra endpoints rápidamente

### Cómo Usar Swagger

1. **Endpoints Públicos** (sin autenticación):
   - Click en el endpoint
   - Click en "Try it out"
   - Edita el JSON si es necesario
   - Click en "Execute"

2. **Endpoints Protegidos** (requieren autenticación):
   - Primero, genera una API key (ver [Autenticación](#-autenticación))
   - Click en el botón "Authorize" 🔓 (arriba a la derecha)
   - Ingresa tu API key
   - Click en "Authorize" y "Close"
   - Ahora puedes usar endpoints protegidos

---

## 🔐 Autenticación

El sistema soporta dos métodos de autenticación:

### 1. API Keys (x-api-key)

#### Generar una API Key

```bash
POST /auth/api-keys
Content-Type: application/json

{
  "name": "Mi API Key de Producción",
  "scopes": ["read:products", "write:products", "read:orders"],
  "expiresAt": "2025-12-31T23:59:59.000Z"
}
```

**Respuesta:**
```json
{
  "message": "API Key generada exitosamente",
  "apiKey": {
    "id": 1,
    "name": "Mi API Key de Producción",
    "key": "rsl_abcd1234efgh5678...",
    "scopes": ["read:products", "write:products", "read:orders"],
    "expiresAt": "2025-12-31T23:59:59.000Z"
  },
  "warning": "Guarda esta clave de forma segura. No se mostrará nuevamente."
}
```

#### Usar API Key

```bash
GET /auth/profile
x-api-key: rsl_abcd1234efgh5678...
```

#### Scopes Disponibles

- `read:products` - Listar productos
- `write:products` - Crear/editar productos
- `read:orders` - Ver pedidos
- `write:orders` - Crear/modificar pedidos
- `read:users` - Ver usuarios
- `write:users` - Crear/editar usuarios

### 2. OAuth2 con Google

#### Iniciar Login con Google

```
GET /auth/google
```

Redirige automáticamente a la página de login de Google.

#### Callback

```
GET /auth/google/callback
```

Google redirige aquí después del login exitoso.

---

## 📁 Estructura del Proyecto

```
E-commerce_Riwi_SportsLine-/
├── src/
│   ├── Auth/                    # Módulo de autenticación
│   │   ├── dto/                 # DTOs para auth
│   │   ├── entities/            # Entidades (ApiKey, OAuthUser)
│   │   ├── guards/              # Guards (api-key, oauth)
│   │   ├── strategies/          # Estrategias Passport
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── Usuarios/                # Módulo de usuarios
│   │   ├── dto/
│   │   ├── usuario.entity.ts
│   │   ├── usuario.controller.ts
│   │   ├── usuario.service.ts
│   │   └── usuario.model.ts
│   │
│   ├── Productos/               # Módulo de productos
│   ├── Clientes/                # Módulo de clientes
│   ├── Pedidos/                 # Módulo de pedidos
│   │
│   ├── common/                  # Componentes compartidos
│   │   ├── decorators/          # Decoradores personalizados
│   │   ├── filters/             # Exception filters
│   │   ├── guards/              # Guards globales
│   │   ├── interceptors/        # Interceptors
│   │   └── middleware/          # Middleware
│   │
│   ├── config/
│   │   └── DataBase.ts          # Configuración TypeORM
│   │
│   ├── Seeds/                   # Seeders de base de datos
│   └── main.ts                  # Bootstrap de la aplicación
│
├── .env                         # Variables de entorno (no versionado)
├── .gitignore
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run start          # Inicia la aplicación
npm run start:dev      # Modo desarrollo con watch
npm run start:debug    # Modo debug con watch

# Producción
npm run build          # Compila a JavaScript
npm run start:prod     # Ejecuta versión compilada

# Calidad de Código
npm run lint           # Ejecuta ESLint
npm run format         # Formatea código con Prettier

# Testing
npm run test           # Ejecuta tests unitarios
npm run test:watch     # Tests en modo watch
npm run test:cov       # Tests con coverage
npm run test:e2e       # Tests end-to-end

# Base de Datos
npm run seed           # Ejecuta seeders
```

---

## 🗄️ Base de Datos

### Entidades Principales

1. **Usuario** - Usuarios del sistema con roles
2. **Cliente** - Clientes que realizan compras
3. **Producto** - Catálogo de productos deportivos
4. **Pedido** - Órdenes de compra
5. **ApiKey** - API keys para autenticación
6. **OAuthUser** - Usuarios autenticados vía OAuth

### Configuración TypeORM

- `synchronize: true` está activo en desarrollo (desactivar en producción)
- Las tablas se crean automáticamente al iniciar
- Relaciones entre entidades configuradas con decoradores

---

## 🔒 Seguridad

### Middleware y Guards

- **LoggingMiddleware**: Registra todas las peticiones HTTP
- **RolesGuard**: Valida roles de usuario (admin/user)
- **ApiKeyGuard**: Valida API keys y scopes
- **GoogleOAuthGuard**: Maneja autenticación OAuth2

### Exception Filters

- **GlobalExceptionFilter**: Manejo centralizado de errores
- Respuestas consistentes con códigos HTTP apropiados
- Logging de errores para debugging

### Interceptors

- **ResponseInterceptor**: Formatea respuestas de forma consistente
- **LoggingInterceptor**: Mide tiempo de ejecución de requests

---

## 🤝 Contribución

### Flujo de Trabajo

1. Crear rama feature:
   ```bash
   git checkout -b feat/nombre-feature
   ```

2. Hacer cambios y commit:
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   ```

3. Push y crear Pull Request:
   ```bash
   git push origin feat/nombre-feature
   ```

### Convenciones de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nueva característica
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Formateo, sin cambios de código
- `refactor:` - Refactorización de código
- `test:` - Agregar o corregir tests
- `chore:` - Tareas de mantenimiento

---

## 📄 Licencia

Este proyecto es privado y pertenece a RIWI.

---

## 🆘 Soporte

Para problemas o preguntas:

1. **Documentación Swagger**: [http://localhost:5000/api](http://localhost:5000/api)
2. **Logs del Servidor**: Revisa la consola para errores detallados
3. **Contacto**: Reporta issues en el repositorio

---

## 📝 Notas Finales

- ✅ **CORS** está habilitado globalmente
- ✅ **Validación** automática de DTOs con class-validator
- ✅ **Hot Reload** activo en modo desarrollo
- ✅ **TypeScript Strict Mode** habilitado
- ⚠️ **Producción**: Recuerda cambiar `synchronize: false` en TypeORM
- ⚠️ **Seguridad**: Nunca versiones el archivo `.env`

---

**Desarrollado con ❤️ por el equipo de RIWI**
