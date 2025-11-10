import { AppDataSource } from './data-source';
import { User } from '../users/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const productRepo = AppDataSource.getRepository(Product);

  const admin = userRepo.create({
    name: 'admin',
    email: 'admin@riwisports.com',
    password: '123456',
  });
  await userRepo.save(admin);

  const product = productRepo.create({
    name: 'Balón Riwi Pro',
    description: 'Balón profesional de fútbol',
    price: 89.99,
    stock: 10,
  });
  await productRepo.save(product);

  console.log(' Seed ejecutado correctamente');
  process.exit(0);
}

seed();
