import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BillingModule } from './billing/billing.module';
import { OrdersModule } from './orders/orders.module';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggingMiddleware } from './utils/middlewares/logging.middleware';

@Module({
  imports: [
    AuthModule,
    OrdersModule,
    BillingModule,
    NotificationsModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          limit: 3,
          ttl: seconds(5),
        },
        {
          name: 'medium',
          limit: 10,
          ttl: seconds(20),
        },
        {
          name: 'long',
          limit: 25,
          ttl: seconds(90),
        },
      ],
      errorMessage: 'Too many requests.',
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
