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
    it('should create and return an edge', async () => {
      const result = new Edge();
      jest.spyOn(service, 'create').mockResolvedValue(result);
      expect(await resolver.createEdge('node1', 'node2')).toBe(result);
    });
  });
});
