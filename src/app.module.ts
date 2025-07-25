import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BillingModule } from './billing/billing.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [AuthModule, OrdersModule, BillingModule, NotificationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
