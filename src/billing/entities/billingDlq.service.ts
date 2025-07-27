import { Injectable, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Injectable()
export class BillingDlqService {
  private readonly logger = new Logger(BillingDlqService.name);

  @EventPattern('billing.dlq')
  async handleDeadLetterMessage(@Payload() message: any): Promise<void> {
    this.logger.error('Processing dead letter message:', {
      originalMessage: message.value.originalMessage,
      error: message.value.error,
      failureReason: message.value.failureReason,
      failedAt: message.value.failedAt,
    });

    await this.logToDatabase(message.value);
    await this.sendAlert(message.value);
  }

  private async logToDatabase(dlqMessage: any): Promise<void> {
    // Store DLQ message in database for investigation
    this.logger.log('Logging DLQ message to database');
  }

  private async sendAlert(dlqMessage: any): Promise<void> {
    // Send alert to monitoring system or email
    this.logger.warn('Sending alert for DLQ message');
  }
}
