import { Controller } from '@nestjs/common';
import { BillingService } from './billing.service';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { Order } from 'src/orders/entities/order.entity';

@Controller()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @EventPattern('order.created')
  async handleOrderCreated(
    @Payload() data: Order,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    console.log('BILLING - Received order created event:', data);

    // const originalKafkaMessage = context.getMessage();
    // console.log('KEY', originalKafkaMessage.key);
    // console.log('VALUE', JSON.stringify(originalKafkaMessage.value));
    // console.log('TIMESTAMP', originalKafkaMessage.timestamp);
    // console.log('OFFSET', originalKafkaMessage.offset);
    // console.log('HEADERS', JSON.stringify(originalKafkaMessage.headers));

    return this.billingService.createPayment(data, context.getMessage());
  }
}
