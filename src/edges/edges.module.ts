import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from '../edge.entity';
import { EdgesResolver } from './edges.resolver';
import { EdgesService } from './edges.service';

@Module({
  imports: [TypeOrmModule.forFeature([Edge])],
  providers: [EdgesResolver, EdgesService],
})
export class EdgesModule {}
