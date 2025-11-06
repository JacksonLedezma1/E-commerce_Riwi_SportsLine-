import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Usuario } from '../Usuarios/usuario.entitie'
import { Cliente } from '../Clientes/cliente.entity'
import { Producto } from '../Productos/producto.entity'
import { Pedido } from '../Pedidos/pedido.entity'
import * as dotenv from 'dotenv';

dotenv.config(); // carga las variables de entorno desde .env

// Crear una instancia de conexión manual con los mismos datos del AppModule
const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    entities: [Usuario, Cliente, Producto, Pedido],
    synchronize: false, // no crear estructuras, solo insertar datos
});

async function runSeed() {
    await dataSource.initialize();
    console.log('🔗 Conectado a la base de datos');

    const usuarioRepo = dataSource.getRepository(Usuario);
    const clienteRepo = dataSource.getRepository(Cliente);
    const productoRepo = dataSource.getRepository(Producto);
    const pedidoRepo = dataSource.getRepository(Pedido);

    // Crear usuario administrador
    const admin = usuarioRepo.create({
        nombre: 'Admin',
        correo: 'admin@riwi.com',
        contrasena: 'Admin123',
    });
    await usuarioRepo.save(admin);

    // Crear cliente ejemplo
    const cliente = clienteRepo.create({
        nombre: 'Juan Pérez',
        direccion: 'Calle 123, Medellín',
    });
    await clienteRepo.save(cliente);

    // Crear productos iniciales
    const productos = productoRepo.create([
        { nombre: 'Balón profesional', precio: 150000 },
        { nombre: 'Guantes de arquero', precio: 80000 },
    ]);
    await productoRepo.save(productos);

    // Crear pedido ejemplo
    const pedido = pedidoRepo.create({
        usuario: admin,
        cliente: cliente,
        productos: productos,
        estado: 'pendiente',
    });
    await pedidoRepo.save(pedido);

    console.log('✅ Seed ejecutado correctamente');
    await dataSource.destroy();
}

runSeed().catch((err) => {
    console.error('❌ Error ejecutando seed:', err);
    dataSource.destroy();
});
