### 🧱 Migración de Sequelize a TypeORM

Se reemplazó el ORM Sequelize por TypeORM para aprovechar:
- Decoradores y tipado nativo de TypeScript.
- Integración directa con el ecosistema NestJS.
- Soporte nativo de migraciones, relaciones y repositorios.

**Entidad base:** `Usuario`
Define los atributos principales (`id`, `nombre`, `email`, `password`, etc.) bajo el estándar de arquitectura modular de NestJS.

Para probar la conexión y endpoints:

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
