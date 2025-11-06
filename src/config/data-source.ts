import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Client } from 'src/client/entities/client.entity';
import { Order } from 'src/order/entities/order.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [User, Product, Client, Order],
  migrations: ['dist/config/migrations/*.js'],
  ssl: { rejectUnauthorized: false },
});
