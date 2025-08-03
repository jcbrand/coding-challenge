import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Edge {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'int', default: 0 })
  capacity: number;

  @Field(() => String, {
    description: 'String representation of the capacity value',
    name: 'capacity' // Expose it as 'capacity' in GraphQL
  })
  get capacityString(): string {
    return this.capacity.toString();
  }

  @Field(() => String)
  @Column()
  node1_alias: string;

  @Field(() => String)
  @Column()
  node2_alias: string;

  @Field(() => String)
  get edge_peers(): string {
    return `[${this.node1_alias}]-[${this.node2_alias}]`;
  }
}
