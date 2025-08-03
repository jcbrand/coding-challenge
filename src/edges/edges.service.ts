import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from '../edge.entity';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class EdgesService {
  constructor(
    @InjectRepository(Edge)
    private edgesRepository: Repository<Edge>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async findAll(): Promise<Edge[]> {
    return this.edgesRepository.find();
  }

  async findOne(id: string): Promise<Edge | null> {
    return this.edgesRepository.findOne({ where: { id } });
  }

  async create(node1_alias: string, node2_alias: string): Promise<Edge> {
    const edge = this.edgesRepository.create({
      node1_alias,
      node2_alias,
      capacity: Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000,
    });
    const savedEdge = await this.edgesRepository.save(edge);

    // Publish to RabbitMQ - using numeric capacity as stored in DB
    await this.rabbitMQService.publish({
      id: savedEdge.id,
      node1_alias: savedEdge.node1_alias,
      node2_alias: savedEdge.node2_alias,
      capacity: savedEdge.capacity, // numeric value
    });

    // Return the edge which will automatically use the string getters
    return savedEdge;
  }
}
