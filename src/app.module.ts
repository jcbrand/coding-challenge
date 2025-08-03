import { Module } from '@nestjs/common';
import { PostgresModule } from './postgres/postgres.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { EdgesModule } from './edges/edges.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Edge } from './edge.entity';

@Module({
  imports: [
    PostgresModule.forRoot([Edge]),
    RabbitMQModule,
    EdgesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
