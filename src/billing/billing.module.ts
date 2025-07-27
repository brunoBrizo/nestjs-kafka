import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BillingDlqService } from './entities/billingDlq.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BILLING_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
            clientId: 'billing-service',
          },
          producer: {
            allowAutoTopicCreation: true,
          },
          consumer: {
            groupId: 'billing-consumer-group',
          },
        },
      },
    ]),
  ],
  controllers: [BillingController],
  providers: [BillingService, BillingDlqService],
})
export class BillingModule {}
