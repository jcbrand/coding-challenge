import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EdgesModule } from './edges/edges.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Edge } from './edge.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port:
        typeof process.env.DB_PORT !== 'undefined'
          ? parseInt(process.env.DB_PORT)
          : 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'postgres',
      entities: [Edge],
      synchronize: true,
    }),
    RabbitMQModule,
    EdgesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
