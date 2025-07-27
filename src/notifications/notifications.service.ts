import { Injectable } from '@nestjs/common';
import { Payment } from 'src/billing/entities/payment.entity';
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class NotificationsService {
  async sendOrderCreatedNotification(order: Order): Promise<void> {}

  async sendPaymentCreatedNotification(payment: Payment): Promise<void> {}

  async sendOrderCancelledNotification(order: Order): Promise<void> {}
}
