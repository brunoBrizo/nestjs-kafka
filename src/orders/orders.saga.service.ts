import { Injectable, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';

@Injectable()
export class OrdersSaga {
  private readonly logger = new Logger(OrdersSaga.name);

  constructor(private readonly ordersService: OrdersService) {}

  @EventPattern('payment.failed')
  async handlePaymentFailed(@Payload() message: any): Promise<void> {
    this.logger.log('Handling payment failed event');
    const { order, error } = message.value;

    this.logger.error(`Payment failed for order ${order.id}: ${error}`);

    // Execute compensation - cancel the order
    this.ordersService.cancelOrder(
      order.id,
      `Payment processing failed: ${error}`,
    );
  }

  @EventPattern('billing.dlq')
  async handleBillingDlq(@Payload() message: any): Promise<void> {
    const { originalMessage, error } = message.value;

    // Extract order ID from the original message
    const order = originalMessage.value;
    if (order && order.id) {
      this.logger.error(
        `Billing service failed for order ${order.id} after max retries`,
      );

      // Execute compensation - cancel the order
      this.ordersService.cancelOrder(
        order.id,
        `Billing service unavailable: ${error.message}`,
      );
    }
  }
}
