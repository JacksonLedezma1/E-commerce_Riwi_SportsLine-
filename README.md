#  E-commerce API - Semana 2  
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

### Criterios de aceptación - Semana 2

Migración completa de Sequelize a TypeORM.
Entidades base: User, Product, Customer, Order.
Relaciones configuradas con decoradores (OneToMany, ManyToOne).
Configuración de Supabase mediante DB_URL.
Migraciones y seeds funcionales.
Repositorios listos para operaciones CRUD.


npm i @nestjs/jwt passport passport-jwt bcrypt
npm i -D @types/passport-jwt @types/passport