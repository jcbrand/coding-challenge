import { Module } from '@nestjs/common';
import { EdgesResolver } from './edges.resolver';
import { EdgesService } from './edges.service';

@Module({
  providers: [EdgesResolver, EdgesService],
})
export class EdgesModule {}
