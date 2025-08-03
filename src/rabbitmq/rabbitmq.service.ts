import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqplib from 'amqplib';
import * as amqp from 'amqp-connection-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from '../edge.entity';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: amqp.ChannelWrapper;

  constructor(
    @InjectRepository(Edge)
    private edgesRepository: Repository<Edge>,
    private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    if (!process.env.RABBITMQ_URL)
      throw new Error(`RABBITMQ_URL env var is not set`);

    this.connection = amqp.connect([process.env.RABBITMQ_URL]);
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel: amqplib.ConfirmChannel) =>
        channel.assertQueue('edges_queue', { durable: true }),
    });

    // Setup consumer
    await this.consume(async (msg) => {
      await this.handleEdgeMessage(msg);
    });
  }

  private async handleEdgeMessage(msg: any) {
    this.logger.log(
      `New channel between ${msg.node1_alias} and ${msg.node2_alias} with a capacity of ${msg.capacity} has been created.`
    );

    try {
      const edge = await this.edgesRepository.findOne({
        where: { id: msg.id },
      });
      if (edge) {
        edge.node1_alias = `${msg.node1_alias}-updated`;
        edge.node2_alias = `${msg.node2_alias}-updated`;
        await this.edgesRepository.save(edge);
        this.logger.log(`Updated edge ${edge.id} with new aliases`);
      }
    } catch (error) {
      this.logger.error(`Error processing edge message: ${error.message}`);
      throw error;
    }
  }

  async publish(message: any) {
    try {
      await this.channelWrapper.sendToQueue(
        'edges_queue',
        Buffer.from(JSON.stringify(message)),
        { deliveryMode: 2 },
      );
    } catch (error) {
      console.error('Error publishing message:', error);
    }
  }

  async consume(callback: (msg: any) => Promise<void>) {
    this.channelWrapper.addSetup(async (channel: amqplib.ConfirmChannel) => {
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
