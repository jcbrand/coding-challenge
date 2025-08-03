import { Module, Logger } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PostgresModule } from './postgres/postgres.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { EdgesModule } from './edges/edges.module';
import { AppController } from './app.controller';
import { Edge } from './edge.entity';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      path: '/graphql',
    }),
    PostgresModule.forRoot([Edge]),
    RabbitMQModule,
    EdgesModule,
  ],
  controllers: [AppController],
  providers: [Logger], // Provide Logger at app level
})
export class AppModule {}
