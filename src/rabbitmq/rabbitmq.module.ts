import { Module, Global, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from '../edge.entity';
import { RabbitMQService } from './rabbitmq.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Edge])],
  providers: [
    RabbitMQService,
    Logger, // Provide the Logger service
  ],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
