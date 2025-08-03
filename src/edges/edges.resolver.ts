import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Edge } from '../edge.entity';
import { EdgesService } from './edges.service';

@Resolver(() => Edge)
export class EdgesResolver {
  constructor(private readonly edgesService: EdgesService) {}

  @Query(() => [Edge])
  async getEdges(): Promise<Edge[]> {
    return this.edgesService.findAll();
  }

  @Query(() => Edge)
  async getEdge(@Args('id') id: string): Promise<Edge|null> {
    return this.edgesService.findOne(id);
  }

  @Mutation(() => Edge)
  async createEdge(
    @Args('node1_alias') node1_alias: string,
    @Args('node2_alias') node2_alias: string,
  ): Promise<Edge> {
    return this.edgesService.create(node1_alias, node2_alias);
  }
}
