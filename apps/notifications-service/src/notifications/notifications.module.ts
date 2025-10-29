import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsConsumer } from './notifications.consumer';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      useFactory: () => ({
        exchanges: [{ name: 'posts', type: 'topic' }],
        uri: process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672',
        connectionInitOptions: {
          wait: true,
          timeout: 15000,
        },
      }),
    }),
  ],
  providers: [
    NotificationsGateway,
    NotificationsConsumer,
    NotificationsService,
  ],
})
export class NotificationsModule {}
