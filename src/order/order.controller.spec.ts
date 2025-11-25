import { TestingModule, Test } from "@nestjs/testing";
import { Order, OrderStatus } from "./entities/order.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";

const mockOrder: Order = {
  id: 1,
  total: 200,
  quantity: 2,
  status: OrderStatus.PENDING,
  createdAt: new Date(),
  updatedAt: new Date(),
  product: { id: 1, name: 'Camisa', price: 100, stock: 50 } as any,
  client: { id: 1, name: 'Juan' } as any,
  createdBy: { id: 1, name: 'Admin' } as any,
};

describe('OrdersController', () => {
    let controller: OrderController;
    let service: OrderService;

    const mockOrderService = {
        createOrder: jest.fn().mockResolvedValue(mockOrder),
        getAllOrders: jest.fn().mockResolvedValue([mockOrder]),
        getOrderById: jest.fn().mockResolvedValue(mockOrder),
        updateOrderStatus: jest.fn().mockResolvedValue({ ...mockOrder, status: OrderStatus.DELIVERED }),
        deleteOrder: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [OrderController],
            providers: [
                {
                    provide: OrderService,
                    useValue: mockOrderService,
                },
            ],
        }).compile();

        controller = moduleRef.get<OrderController>(OrderController);
        service = moduleRef.get<OrderService>(OrderService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        it('should create an order', async () => {
            const dto: CreateOrderDto = {
                productId: 1,
                clientId: 1,
                createdById: 1,
                quantity: 2,
                total: 200,
            };

            mockOrderService.createOrder.mockResolvedValueOnce(mockOrder);

            const result = await controller.createOrder(dto);
            expect(result).toEqual(mockOrder);
            expect(service.createOrder).toHaveBeenCalledWith(dto);
        });
    });

    describe('getAllOrders', () => {
        it('should return an array of orders', async () => {
            mockOrderService.getAllOrders.mockResolvedValueOnce([mockOrder]);
            const result = await controller.getAllOrders();
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual([mockOrder]);
        });
    });

    describe('getOrderById', () => {
        it('should return a single order', async () => {
            mockOrderService.getOrderById.mockResolvedValueOnce(mockOrder);
            const result = await controller.getOrderById(1);
            expect(result).toEqual(mockOrder);
            expect(mockOrderService.getOrderById).toHaveBeenCalledWith(1);
        });
    });

    
})