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
    await this.rabbitMQService.publish(savedEdge);

    return savedEdge;
  }
}
