import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from '../edge.entity';

@Injectable()
export class EdgesService {
  constructor(
    @InjectRepository(Edge)
    private edgesRepository: Repository<Edge>,
  ) {}

  async findAll(): Promise<Edge[]> {
    return this.edgesRepository.find();
  }

  async findOne(id: string): Promise<Edge> {
    return this.edgesRepository.findOne({ where: { id } });
  }

  async create(node1_alias: string, node2_alias: string): Promise<Edge> {
    const edge = this.edgesRepository.create({
      node1_alias,
      node2_alias,
      capacity: 0,
    });
    return this.edgesRepository.save(edge);
  }
}
