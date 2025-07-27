import { Controller } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from 'src/billing/entities/payment.entity';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('order.created')
  async handleOrderCreated(@Payload() data: Order): Promise<void> {
    console.log('NOTIFICATIONS - Received order created event:', data);
    return await this.notificationsService.sendOrderCreatedNotification(data);
  }

  @EventPattern('payment.created')
  async handlePaymentCreated(@Payload() data: Payment): Promise<void> {
    console.log('NOTIFICATIONS - Received payment created event:', data);
    return await this.notificationsService.sendPaymentCreatedNotification(data);
  }

  @EventPattern('order.cancelled')
  async handleOrderCancelled(@Payload() data: Order): Promise<void> {
    console.log('NOTIFICATIONS - Received order cancelled event:', data);
    return await this.notificationsService.sendOrderCancelledNotification(data);
  }
}
