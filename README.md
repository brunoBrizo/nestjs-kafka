# NestJS + Kafka Microservices Demo

A comprehensive demonstration project showcasing **event-driven microservices architecture** built with **NestJS** and **Apache Kafka**. This project illustrates modern distributed systems patterns including event sourcing, saga pattern, dead letter queues, and resilient error handling.

## 🚀 Features

### Core Architecture

- **Event-driven microservices** using Apache Kafka
- **Saga pattern** for distributed transaction management
- **Dead Letter Queue (DLQ)** pattern for failed message handling
- **Retry mechanisms** with exponential backoff
- **Request/Response** and **Event** messaging patterns

### Microservices

- **Orders Service**: Order creation, cancellation, and management
- **Billing Service**: Payment processing with failure simulation
- **Auth Service**: User management and authentication
- **Notifications Service**: Event-driven notification system

### Infrastructure Features

- **Rate limiting** with multiple throttling tiers
- **Global error handling** with custom filters
- **Request/Response interceptors**
- **Logging middleware**
- **Input validation** with class-validator
- **Docker Compose** setup for local Kafka

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Orders API    │    │  Billing API    │    │   Auth API      │    │Notifications API│
│                 │    │                 │    │                 │    │                 │
│ • Create Order  │    │ • Process Pay   │    │ • Get User      │    │ • Send Alerts   │
│ • Cancel Order  │    │ • Handle Fails  │    │ • Authenticate  │    │ • Order Events  │
│ • List Orders   │    │ • Send to DLQ   │    │                 │    │ • Pay Events    │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │                      │
          │              ┌───────▼──────────────────────▼──────────────────────▼───────┐
          └──────────────►│                     Apache Kafka                           │
                         │                                                            │
                         │ • Topics: order.created, payment.failed, billing.dlq      │
                         │ • Events: order.cancelled, payment.created, user.getUser  │
                         │ • DLQ Pattern • Saga Pattern • Request/Response Pattern   │
                         └────────────────────────────────────────────────────────────┘
```

### Event Flow

1. **Order Created** → Triggers payment processing
2. **Payment Failed** → Saga compensation (order cancellation)
3. **Billing DLQ** → Failed messages handled with compensation
4. **Order Cancelled** → Notification events

## 📋 Description

This project demonstrates modern distributed systems patterns and event-driven architecture using NestJS and Apache Kafka. It's designed as a learning resource and interview preparation material for understanding microservices communication, error handling, and resilience patterns.

## 🛠️ Technologies Used

- **NestJS** - Progressive Node.js framework
- **Apache Kafka** - Distributed event streaming platform
- **KafkaJS** - Modern Apache Kafka client for Node.js
- **TypeScript** - Type-safe JavaScript
- **Docker Compose** - Container orchestration
- **Class Validator** - Validation decorators
- **RxJS** - Reactive programming

## 📦 Project Setup

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd nest-kafka
```

2. **Install dependencies**

```bash
npm install
```

3. **Start Kafka using Docker Compose**

```bash
docker-compose up -d
```

4. **Verify Kafka is running**

```bash
docker ps
# You should see a kafka container running on ports 9092 and 9093
```

## 🚀 Running the Application

```bash
# Development mode with auto-reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The application will start on `http://localhost:3000`

## 🧪 Testing the Event Flow

### 1. Create an Order

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "totalAmount": "99.99",
    "status": "pending",
    "userId": "user1"
  }'
```

### 2. List Orders

```bash
curl http://localhost:3000/orders
```

### 4. Monitor Console Logs

Watch the console for event processing logs including:

- Order creation events
- Payment processing (with simulated failures)
- Saga compensation actions
- DLQ message handling

## 📊 Kafka Topics and Events

### Topics Used

- `order.created` - New order events
- `order.cancelled` - Order cancellation events
- `payment.created` - Successful payment events
- `payment.failed` - Failed payment events
- `billing.dlq` - Dead letter queue for billing failures
- `user.getUser` - User lookup requests

### Event Patterns

- **Request/Response**: `user.getUser` pattern
- **Fire-and-Forget**: Order and payment events
- **DLQ Pattern**: Failed billing messages
- **Saga Pattern**: Order cancellation compensation

## 🎯 Key Learning Concepts

### 1. Saga Pattern Implementation

```typescript
@EventPattern('payment.failed')
async handlePaymentFailed(@Payload() message: any): Promise<void> {
  // Compensation logic - cancel the order
  this.ordersService.cancelOrder(order.id, `Payment failed: ${error}`);
}
```

### 2. Dead Letter Queue Pattern

```typescript
private async sendToDlq(originalMessage: KafkaMessage, error: Error): Promise<void> {
  const dlqMessage = {
    originalMessage,
    error: { message: error.message, stack: error.stack },
    failedAt: new Date(),
    retryCount: this.maxRetries,
  };
  this.kafkaClient.emit('billing.dlq', { key: originalMessage.key, value: dlqMessage });
}
```

### 3. Retry with Exponential Backoff

```typescript
if (retry < this.maxRetries) {
  await this.delay(1000 * Math.pow(2, retry)); // Exponential backoff
  await this.createPayment(order, originalMessage, retry + 1);
}
```

## 📁 Project Structure

```
src/
├── app.module.ts              # Main application module
├── main.ts                    # Application entry point with Kafka setup
├── auth/                      # Authentication microservice
│   ├── auth.controller.ts     # User endpoints
│   ├── auth.service.ts        # User management logic
│   └── entities/user.entity.ts
├── billing/                   # Billing microservice
│   ├── billing.controller.ts  # Payment endpoints
│   ├── billing.service.ts     # Payment processing with DLQ
│   └── entities/
│       ├── billingDlq.service.ts
│       └── payment.entity.ts
├── orders/                    # Orders microservice
│   ├── orders.controller.ts   # Order endpoints
│   ├── orders.service.ts      # Order business logic
│   ├── orders.saga.service.ts # Saga pattern implementation
│   ├── dto/create-order.dto.ts
│   └── entities/order.entity.ts
├── notifications/             # Notifications microservice
│   ├── notifications.controller.ts
│   └── notifications.service.ts
└── utils/                     # Shared utilities
    ├── filters/httpException.filter.ts
    ├── interceptors/response.interceptor.ts
    └── middlewares/logging.middleware.ts
```

## 🚨 Error Handling Features

- **Global Exception Filter**: Standardized error responses
- **Validation Pipes**: Input validation with class-validator
- **Rate Limiting**: Multi-tier throttling (3/5s, 10/20s, 25/90s)
- **Retry Logic**: Exponential backoff for failed operations
- **Dead Letter Queue**: Persistent storage for failed messages
- **Saga Compensation**: Automatic rollback for failed transactions

## 📖 Learning Resources

This project demonstrates:

- **Event-driven architecture** principles
- **Microservices communication** patterns
- **Distributed transaction** management
- **Error handling** and **resilience** patterns
- **Apache Kafka** integration with NestJS
- **Dead Letter Queue** implementation
- **Saga pattern** for compensation

## 📄 License

This project is [MIT licensed](LICENSE).

---

**Built for learning and demonstration purposes** 🚀

_This project showcases modern microservices patterns and serves as a comprehensive example for understanding event-driven architecture with NestJS and Apache Kafka._
