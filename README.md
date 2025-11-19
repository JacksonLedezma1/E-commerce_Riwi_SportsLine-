 # RIWI SportsLine – Backend (NestJS + TypeORM + PostgreSQL)
 
 Proyecto backend para el e-commerce RIWI SportsLine. Basado en NestJS con TypeORM y PostgreSQL, usando variables de entorno para configuración.
 
 ## 🚀 Tech Stack
 - NestJS
 - TypeORM
 - PostgreSQL
 - @nestjs/config (variables de entorno)
 
 ## 📁 Estructura (actual)
 ```
 src/
 ├─ Clientes/
 ├─ Pedidos/
 ├─ Productos/
 ├─ Seeds/
 ├─ Usuarios/
 ├─ config/
 │  └─ DataBase.ts       # AppModule con ConfigModule y TypeOrmModule
 └─ main.ts              # Bootstrap de Nest (CORS activo, puerto desde .env)
 .env                    # Variables de entorno (no versionado)
 package.json
 ```
 
 ## ⚙️ Requisitos previos
 - Node.js 18+
 - npm 9+
 - PostgreSQL 13+
 - (Opcional) Nest CLI: `npm i -g @nestjs/cli`
 
 ## 🔐 Variables de entorno
 Crea un archivo `.env` en la raíz con, por ejemplo:
 ```
 PORT=5000
 DATABASE_HOST=localhost
 DATABASE_PORT=5432
 DATABASE_USER=postgres
 DATABASE_PASS=postgres
 DATABASE_NAME=riwi_sportsline
 ```
 Si no defines `PORT`, la app usa 5000 por defecto.
 
 ## 📦 Instalación
 ```bash
 npm install
 ```
 
 ## ▶️ Ejecución
 Scripts disponibles (ver `package.json`):
 - `start`: inicia la app
 - `start:dev`: inicia en modo watch
 - `start:debug`: modo debug + watch
 - `start:prod`: ejecuta `node dist/main`
 - `build`: compila a `dist`
 - `lint`, `format`, `test`, `test:e2e`
 - `seed`: ejecuta `src/seeds/seed.ts`
 
 Comandos útiles:
 ```bash
 npm run start:dev
 # o
 npm run start
 ```
 
 Base URL por defecto: `http://localhost:5000` (o el puerto definido en `PORT`).
 
 ## 🗄️ Base de datos
 - El módulo `TypeOrmModule.forRoot` usa variables `.env` para conectarse a Postgres.
 - `synchronize: true` está activado para desarrollo (no recomendado en producción).
 
 ## Peticiones en Postman
 
 ---
 
 ## 🚀 1. USUARIOS
 
 **Endpoint base:** `/usuarios`
 
 ### ➕ Crear usuario
 
 **POST** `/usuarios`
 
 ```json
 {
   "nombre": "Carlos Ruiz",
   "correo": "carlos@correo.com",
   "password": "123456"
 }
 ```
 
 ### 🔍 Listar todos los usuarios
 
 **GET** `/usuarios`
 
 ### 🔍 Obtener un usuario por ID
 
 **GET** `/usuarios/1`
 
 ### ✏️ Actualizar usuario
 
 **PATCH** `/usuarios/1`
 
 ```json
 {
   "nombre": "Carlos Ruiz Actualizado"
 }
 ```
 
 ### ❌ Eliminar usuario
 
 **DELETE** `/usuarios/1`
 
 ---
 
 ## 👥 2. CLIENTES
 
 **Endpoint base:** `/clientes`
 
 ### ➕ Crear cliente
 
 **POST** `/clientes`
 
 ```json
 {
   "nombre": "María López",
   "direccion": "Calle 45 #23-10"
 }
 ```
 
 ### 🔍 Listar clientes
 
 **GET** `/clientes`
 
 ---
 
 ## 🛒 3. PRODUCTOS
 
 **Endpoint base:** `/productos`
 
 ### ➕ Crear producto
 
 **POST** `/productos`
 
 ```json
 {
   "nombre": "Balón de fútbol",
   "precio": 150000
 }
 ```
 
 ### 🔍 Listar productos
 
 **GET** `/productos`
 
 ### ✏️ Actualizar producto
 
 **PATCH** `/productos/1`
 
 ```json
 {
   "precio": 120000
 }
 ```
 
 ---
 
 ## 📦 4. PEDIDOS
 
 **Endpoint base:** `/pedidos`
 
 > 💡 Para crear un pedido primero asegúrate de tener creados al menos:
 >
 > * 1 **usuario**
 > * 1 **cliente**
 > * 1 o más **productos**
 
 ### ➕ Crear pedido
 
 **POST** `/pedidos`
 
 ```json
 {
   "usuarioId": 1,
   "clienteId": 1,
   "productosIds": [1, 2],
   "estado": "pendiente"
 }
 ```
 
 ### 🔍 Listar pedidos
 
 **GET** `/pedidos`
 
 ### 🔍 Obtener pedido por ID
 
 **GET** `/pedidos/1`
 
 ### ✏️ Actualizar estado del pedido
 
 **PATCH** `/pedidos/1`
 
 ```json
 {
   "estado": "enviado"
 }
 ```
 
 ### ❌ Eliminar pedido
 
 **DELETE** `/pedidos/1`
 
 ---
 
 ## ✅ Estado actual y próximos pasos
 - `main.ts` presente con CORS habilitado y puerto desde `.env` (default 5000).
 - Scripts de ejecución, build, test y seed configurados en `package.json`.
 - Módulo de base de datos en `config/DataBase.ts` usando variables `.env`.
 - Pendiente:
   - Verificar/ajustar `entities` y relaciones en TypeORM.
   - Documentar endpoints adicionales si cambian con nuevas historias de usuario.
   - Configurar ESLint/Prettier según convenciones del equipo.

### Semana 4: Middleware, Filtros e Interceptores ✅ COMPLETADO

**Implementado:**
- ✅ Middleware de auditoría y logging
- ✅ Exception Filter global para manejo de errores
- ✅ Guards personalizados para validación de roles
- ✅ Interceptors para formateo de respuestas y medición de tiempo
- ✅ Pruebas unitarias (19 tests pasando)
- ✅ Documentación completa

**Archivos nuevos:**
- `src/common/middleware/loggin.middleware.ts` - Logging de peticiones
- `src/common/guards/roles.guard.ts` - Validación de roles (mejorado)
- `src/common/interceptors/response.interceptor.ts` - Formateo de respuestas
- `src/common/interceptors/logging.interceptor.ts` - Medición de tiempo
- `src/common/README.md` - Documentación de componentes
- `IMPLEMENTATION_GUIDE.md` - Guía de implementación
- `USAGE_EXAMPLES.md` - Ejemplos de uso
- `ARCHITECTURE.md` - Diagrama de arquitectura
- `QUICK_START.md` - Inicio rápido

**Documentación:**
- Consulta `QUICK_START.md` para empezar rápidamente
- Consulta `USAGE_EXAMPLES.md` para ejemplos de controladores
- Consulta `ARCHITECTURE.md` para entender el flujo completo
- Consulta `src/common/README.md` para documentación detallada

### Próximos pasos:
- Implementar autenticación JWT
- Agregar validación de permisos más granulares
- Implementar rate limiting
- Agregar logging a archivos
- Integrar con servicios de monitoreo
 
 ## 🤝 Contribución
 1. Crear rama feature: `git checkout -b feat/<nombre>`
 2. Commit: `git commit -m "feat: <cambio>"`
 3. Push: `git push origin feat/<nombre>`
