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
└─ config/
    └─ DataBase.ts       # AppModule con ConfigModule y TypeOrmModule
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
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASS=postgres
DATABASE_NAME=riwi_sportsline
```

## 📦 Instalación
```bash
npm install
```

## ▶️ Ejecución
Actualmente `package.json` no define scripts. Opciones:
- Si usas Nest CLI (recomendado):
  1) Añade las dependencias de desarrollo y scripts:
     - devDeps: `@nestjs/cli`, `@nestjs/core`, `@nestjs/common`, `reflect-metadata`, `rxjs`, `typescript`, `ts-node`, `tsconfig-paths`
     - scripts sugeridos:
       - "start": "nest start"
       - "start:dev": "nest start --watch"
  2) Ejecuta:
```bash
npm run start:dev
```
- Alternativa manual (si no usas CLI): configura `ts-node` o compila TypeScript y ejecuta `node dist/main.js` (requiere `main.ts`, no presente aún).

## 🗄️ Base de datos
- El módulo `TypeOrmModule.forRoot` usa variables `.env` para conectarse a Postgres.
- `synchronize: true` está activado para desarrollo (no recomendado en producción).

## ✅ Estado actual y próximos pasos
- Configuración base de ConfigModule + TypeOrmModule lista.
- Pendiente:
  - Añadir archivos Nest estándar (`main.ts`, `app.module.ts` si se separa de `DataBase.ts`, carpetas `modules/` o `domains/`).
  - Definir `entities` reales y registrarlas.
  - Agregar scripts en `package.json` y devDependencies.
  - Configurar ESLint/Prettier si aplica.

## 🤝 Contribución
1. Crear rama feature: `git checkout -b feat/<nombre>`
2. Commit: `git commit -m "feat: <cambio>"`
3. Push: `git push origin feat/<nombre>`
4. Abrir Pull Request

