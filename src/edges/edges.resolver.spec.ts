import { Test } from '@nestjs/testing';
import { EdgesResolver } from './edges.resolver';
import { EdgesService } from './edges.service';
import { Edge } from '../edge.entity';

describe('EdgesResolver', () => {
  let resolver: EdgesResolver;
  let service: EdgesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EdgesResolver,
        {
          provide: EdgesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<EdgesResolver>(EdgesResolver);
    service = module.get<EdgesService>(EdgesService);
  });

  describe('getEdges', () => {
    it('should return an array of edges', async () => {
      const result = [new Edge()];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect(await resolver.getEdges()).toBe(result);
    });
  });

  describe('getEdge', () => {
    it('should return a single edge', async () => {
      const result = new Edge();
      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      expect(await resolver.getEdge('test-id')).toBe(result);
    });
  });

  describe('createEdge', () => {
    it('should return edge with properly formatted string fields', async () => {
      const mockEdge = new Edge();
      mockEdge.id = 'test-id';
      mockEdge.node1_alias = 'nodeA';
      mockEdge.node2_alias = 'nodeB';
      mockEdge.capacity = 75000;
      mockEdge.created_at = new Date('2023-01-01');
      mockEdge.updated_at = new Date('2023-01-02');

      jest.spyOn(service, 'create').mockResolvedValue(mockEdge);

      const result = await resolver.createEdge('nodeA', 'nodeB');

      // Verify string fields in GraphQL response
      expect(result).toMatchObject({
        id: 'test-id',
        node1_alias: 'nodeA',
        node2_alias: 'nodeB',
        capacityString: '75000',
        edge_peers: '[nodeA]-[nodeB]'
      });
      expect(result.created_at.toISOString()).toBe('2023-01-01T00:00:00.000Z');
      expect(result.updated_at.toISOString()).toBe('2023-01-02T00:00:00.000Z');
    });
  });
});
