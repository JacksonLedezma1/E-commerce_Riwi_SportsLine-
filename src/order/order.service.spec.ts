import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Client } from 'src/client/entities/client.entity';
import { User } from 'src/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

const mockOrder = {
  id: 1,
  total: 200,
  quantity: 2,
  status: OrderStatus.PENDING,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProduct = { id: 1, name: 'Camisa', price: 100 };
const mockClient = { id: 1, name: 'Juan' };
const mockUser = { id: 1, name: 'Admin' };

describe('OrdersService', () => {
  let service: OrderService;
  let orderRepo: Repository<Order>;
  let productRepo: Repository<Product>;
  let clientRepo: Repository<Client>;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Product),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(Client),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepo = module.get(getRepositoryToken(Order));
    productRepo = module.get(getRepositoryToken(Product));
    clientRepo = module.get(getRepositoryToken(Client));
    userRepo = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('debería crear una orden correctamente', async () => {
      const dto = {
        productId: 'p1',
        clientId: 'c1',
        createdById: 'u1',
        quantity: 2,
        total: 200,
      };

      jest.spyOn(productRepo, 'findOne').mockResolvedValue(mockProduct as Product);
      jest.spyOn(clientRepo, 'findOne').mockResolvedValue(mockClient as Client);
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(orderRepo, 'create').mockReturnValue(mockOrder as Order);
      jest.spyOn(orderRepo, 'save').mockResolvedValue(mockOrder as Order);

      const result = await service.createOrder(dto as any);
      expect(result).toEqual(mockOrder);
      expect(orderRepo.create).toHaveBeenCalled();
      expect(orderRepo.save).toHaveBeenCalled();
    });

    it('debería lanzar error si el producto no existe', async () => {
      jest.spyOn(productRepo, 'findOne').mockResolvedValue(null);

      await expect(
        service.createOrder({
          productId: 'x',
          clientId: 'c1',
          createdById: 'u1',
          quantity: 1,
          total: 100,
        } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll()', () => {
    it('debería retornar todas las órdenes', async () => {
      jest.spyOn(orderRepo, 'find').mockResolvedValue([mockOrder as Order]);
      const result = await service.findAllOrders();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockOrder);
    });
  });

  describe('findOne()', () => {
    it('debería retornar una orden existente', async () => {
      jest.spyOn(orderRepo, 'findOne').mockResolvedValue(mockOrder as Order);
      const result = await service.findOrderById(1);
      expect(result).toEqual(mockOrder);
    });

    it('debería lanzar error si la orden no existe', async () => {
      jest.spyOn(orderRepo, 'findOne').mockResolvedValue(null);
      await expect(service.findOrderById(5)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus()', () => {
    it('debería actualizar el estado de una orden', async () => {
      jest.spyOn(orderRepo, 'findOne').mockResolvedValue(mockOrder as Order);
      jest.spyOn(orderRepo, 'save').mockResolvedValue({
        ...mockOrder,
        status: OrderStatus.SHIPPED,
      } as Order);

      const result = await service.updateOrder(1, { status: OrderStatus.SHIPPED });
      expect(result.status).toBe(OrderStatus.SHIPPED);
    });
  });

  describe('remove()', () => {
    it('debería eliminar una orden existente', async () => {
      jest.spyOn(orderRepo, 'findOne').mockResolvedValue(mockOrder as Order);
      jest.spyOn(orderRepo, 'remove').mockResolvedValue(mockOrder as Order);
      await service.deleteOrder(1);
      expect(orderRepo.remove).toHaveBeenCalledWith(mockOrder);
    });
  });
});
