import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: amqp.ChannelWrapper;

  async onModuleInit() {
    this.connection = amqp.connect([process.env.RABBITMQ_URL]);
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel) => channel.assertQueue('edges_queue', { durable: true }),
    });
  }

  async publish(message: any) {
    try {
      await this.channelWrapper.sendToQueue(
        'edges_queue',
        Buffer.from(JSON.stringify(message)),
        { persistent: true },
      );
    } catch (error) {
      console.error('Error publishing message:', error);
    }
  }

  async consume(callback: (msg: any) => Promise<void>) {
    this.channelWrapper.addSetup(async (channel) => {
      await channel.consume('edges_queue', async (msg) => {
        if (msg) {
          try {
            await callback(JSON.parse(msg.content.toString()));
            channel.ack(msg);
          } catch (error) {
            console.error('Error processing message:', error);
            channel.nack(msg);
          }
        }
      });
    });
  }
}
