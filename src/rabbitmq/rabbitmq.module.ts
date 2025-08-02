import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from '../edge.entity';
import { RabbitMQService } from './rabbitmq.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Edge])],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
