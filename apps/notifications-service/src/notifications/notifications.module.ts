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
        uri: process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
        connectionInitOptions: { wait: true },
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
