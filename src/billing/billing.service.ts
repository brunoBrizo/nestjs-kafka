import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from './entities/payment.entity';
import { KafkaMessage } from 'kafkajs';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private readonly maxRetries = 3;

  constructor(
    @Inject('BILLING_SERVICE') private readonly kafkaClient: ClientKafkaProxy,
  ) {}

  async createPayment(
    order: Order,
    originalMessage: KafkaMessage,
    retry = 0,
  ): Promise<void> {
    try {
      const newPayment: Payment = {
        id: crypto.randomUUID(),
        orderId: order.id,
        amount: order.totalAmount,
        status: 'PAID',
        createdAt: new Date(),
        updatedAt: null,
      };

      throw new Error('Simulated payment failure'); // Simulate a failure for testing

      this.payments.push(newPayment);

      this.kafkaClient.emit('payment.created', {
        key: order.id,
        value: newPayment,
      });
    } catch (error) {
      this.logger.error(
        `Failed to create payment for order ${order.id}: ${error.message}`,
      );

      if (retry < this.maxRetries) {
        this.logger.warn(`Retrying payment creation for order ${order.id}`);
        await this.delay(1000 * Math.pow(2, retry)); // Exponential backoff
        await this.createPayment(order, originalMessage, retry + 1);
      } else {
        this.kafkaClient.emit('payment.failed', {
          key: order.id,
          value: {
            order,
            error: error.message,
            failedAt: new Date(),
          },
        });

        await this.sendToDlq(originalMessage, error);
      }
    }
  }

  private payments: Payment[] = [
    {
      id: crypto.randomUUID(),
      orderId: crypto.randomUUID(),
      amount: '100.0',
      status: 'paid',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      orderId: crypto.randomUUID(),
      amount: '200.0',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  findAllPayments(): Payment[] {
    return this.payments;
  }

  findById(id: string): Payment {
    return this.payments.find((payment) => payment.id === id);
  }

  private async sendToDlq(
    originalMessage: KafkaMessage,
    error: Error,
  ): Promise<void> {
    try {
      const dlqMessage = {
        originalMessage,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        failedAt: new Date(),
        retryCount: this.maxRetries,
      };

      this.kafkaClient.emit('billing.dlq', {
        key: originalMessage.key ?? null,
        value: dlqMessage,
      });

      this.logger.log(`Message sent to DLQ: ${JSON.stringify(dlqMessage)}`);
    } catch (error) {
      this.logger.error(`Failed to send message to DLQ: ${error.message}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
