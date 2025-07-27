import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('user.getUser');
  }

  constructor(
    @Inject('ORDERS_SERVICE') private readonly kafkaClient: ClientKafkaProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { totalAmount, status, userId } = createOrderDto;

    const user = await firstValueFrom(
      this.kafkaClient.send('user.getUser', userId),
    );

    console.log(`Creating order for user: ${userId}`, JSON.stringify(user));

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const newOrder: Order = {
      id: crypto.randomUUID(),
      totalAmount,
      status,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.orders.push(newOrder);

    this.kafkaClient.emit('order.created', {
      key: newOrder.id,
      value: newOrder,
    });
    return newOrder;
  }

  cancelOrder(orderId: string, reason: string): void {
    const order = this.ordersDb().find((o) => o.id === orderId);

    if (order) {
      const cancelledAt = new Date();
      order.status = 'CANCELLED';
      order.updatedAt = cancelledAt;

      this.logger.warn(`Order ${orderId} cancelled. Reason: ${reason}`);

      this.kafkaClient.emit('order.cancelled', {
        key: order.id,
        value: {
          order,
          reason,
          cancelledAt,
        },
      });
    } else {
      this.logger.error(`Order ${orderId} not found for cancellation.`);
    }
  }

  // apply pagination and sorting
  findAll() {
    return this.ordersDb();
  }

  findOne(id: string) {
    if (!id) {
      throw new Error('Order ID is required');
    }

    const order = this.ordersDb().find((order) => order.id === id.toString());
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }

    return order;
  }

  private orders: Order[] = [
    {
      id: crypto.randomUUID(),
      totalAmount: '100.00',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user1',
    },
    {
      id: crypto.randomUUID(),
      totalAmount: '200.00',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user2',
    },
    {
      id: crypto.randomUUID(),
      totalAmount: '150.00',
      status: 'cancelled',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user1',
    },
    {
      id: crypto.randomUUID(),
      totalAmount: '300.00',
      status: 'shipped',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user2',
    },
    {
      id: crypto.randomUUID(),
      totalAmount: '250.00',
      status: 'delivered',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user1',
    },
  ];

  private ordersDb(): Order[] {
    return this.orders;
  }
}
