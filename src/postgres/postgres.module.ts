import { DynamicModule, Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from '../edge.entity';

@Global()
@Module({})
export class PostgresModule {
  static forRoot(entities: any[] = [Edge]): DynamicModule {
    return {
      module: PostgresModule,
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
          entities: [...entities],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([...entities]),
      ],
      exports: [TypeOrmModule],
    };
  }
}
