#  E-commerce API 
**Migración a TypeORM + Supabase (NestJS + PostgreSQL)**

---

###  Migración de Sequelize a TypeORM

Se reemplazó **Sequelize** por **TypeORM** para aprovechar:
- Decoradores y tipado nativo de **TypeScript**.
- Integración directa con el ecosistema **NestJS**.
- Soporte nativo de **migraciones**, **relaciones** y **repositorios personalizados**.
- Compatibilidad sencilla con **Supabase (PostgreSQL)**.

---

###  Entidad base: `User`

```ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../orders/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
```

Configuración de TypeORM (src/config/database.config.ts)

La configuraccion de typeORM conecta automáticamente con la base de datos de Supabase y carga todas las entidades registradas en los módulos.

### Relaciones y entidades adicionales

| Entidad              | Relación | Descripción                               |
| -------------------- | -------- | ----------------------------------------- |
| `User` → `Order`     | 1:N      | Un usuario puede tener varios pedidos     |
| `Product` → `Order`  | 1:N      | Un producto puede estar en muchos pedidos |
| `Customer` → `Order` | 1:N      | Un cliente puede tener varios pedidos     |

Las entidades Product, Customer y Order siguen el mismo patrón modular, declaradas con @Entity() y relaciones @ManyToOne() o @OneToMany() según corresponda.


### Migraciones y Seeds

#### Crear migración
npm run typeorm migration:generate -- -n InitSchema

#### Ejecutar migraciones
npm run typeorm migration:run
npm run typeorm migration:revert

#### Crear un seed inicial
```ts
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

export const seed = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(User);
  const password = await bcrypt.hash('admin123', 10);

  const admin = repo.create({
    name: 'Admin',
    email: 'admin@example.com',
    password,
  });

  await repo.save(admin);
  console.log(' Usuario admin creado');
}; 
```

### Comandos del proyecto

# development
npm run start

# watch mode
npm run start:dev

# production
npm run start:prod

### Ejecutar pruebas 
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov

### Criterios de aceptación 

Migración completa de Sequelize a TypeORM.
Entidades base: User, Product, Customer, Order.
Relaciones configuradas con decoradores (OneToMany, ManyToOne).
Configuración de Supabase mediante DB_URL.
Migraciones y seeds funcionales.
Repositorios listos para operaciones CRUD.

# Estructura del módulo Auth

src/
│── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │    ├── jwt.strategy.ts
│   │    ├── refresh.strategy.ts
│   ├── guards/
│   │    ├── jwt.guard.ts
│   │    ├── refresh.guard.ts
│   │    ├── roles.guard.ts
│   │    ├── permissions.guard.ts
│   ├── decorators/
│   │    ├── get-user.decorator.ts
│   │    ├── roles.decorator.ts
│   │    ├── permissions.decorator.ts
│   ├── dto/
│   │    ├── login.dto.ts
│   │    ├── refresh-token.dto.ts


## Estructura del modulo Roles y Permisos

src/
│── roles/
│   ├── roles.module.ts
│   ├── roles.service.ts
│   ├── roles.controller.ts
│   ├── entities/
│        ├── role.entity.ts
│        ├── permission.entity.ts

## Flujo de Autenticación

### Login
Se valida el usuario + contraseña.
Se genera un Access Token (15min).
Se genera un Refresh Token (7 días).
Se almacena el refresh token encriptado en la BD.

### Refresh Token
El cliente envía su refresh token.
Se compara con el token en BD (bcrypt).
Se generan nuevos tokens.
Se actualiza el refresh token almacenado.

### Logout
Se borra el refresh token de BD.

### Register
Se encripta password.
Se asigna un rol inicial.
Se guarda el usuario.

## Roles y Permisos desde la Base de Datos
### Entidad Role
Relación 1:N con usuarios.
Relación N:N con permisos.

### Entidad Permission
Descripción del permiso.
Lista de roles asociados.
Esto permite:
Administrar roles en la BD.
Dar permisos granulares.
Combinarlos con guards personalizados.

## Guards y Decoradores personalizados
@Roles('admin')
Protege rutas basadas en el nombre del rol.

@Permissions('create_product')
Protege por permisos específicos.

Guards aplicados:
JwtAuthGuard
RefreshAuthGuard
RolesGuard
PermissionsGuard

## Documentación Swagger
Se activo autenticacion en JWT 
```ts
.addBearerAuth(
  { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
  'access-token'
)

//Cada empoint protegido usa

@ApiBearerAuth('access-token')

```

## Comandos instalados para la semana
npm i @nestjs/jwt passport passport-jwt bcrypt
npm i -D @types/passport-jwt @types/passport

## Criterios de aceptación - Semana 5
✔️ Autenticación y autorización implementadas con Passport + JWT
✔️ Access Token + Refresh Token funcional
✔️ Refresh token almacenado en BD de forma segura
✔️ Roles y permisos extraídos desde las entidades Role & Permission
✔️ Guards personalizados para roles y permisos
✔️ Decoradores @Roles() y @Permissions()
✔️ Protección de rutas crítica
✔️ Documentación Swagger con BearerAuth
✔️ AuthController y AuthService completos
