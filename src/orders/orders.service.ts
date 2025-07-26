import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  create(createOrderDto: CreateOrderDto) {
    const { totalAmount, status, userId } = createOrderDto;

    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 15),
      totalAmount,
      status,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.orders.push(newOrder);

    // emit events here
    return newOrder;
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

  private orders = [
    {
      id: '1',
      totalAmount: '100.00',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user1',
    },
    {
      id: '2',
      totalAmount: '200.00',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user2',
    },
    {
      id: '3',
      totalAmount: '150.00',
      status: 'cancelled',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user1',
    },
    {
      id: '4',
      totalAmount: '300.00',
      status: 'shipped',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user2',
    },
    {
      id: '5',
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
