import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Edge } from '../edge.entity';
import { EdgesService } from './edges.service';
import { Repository } from 'typeorm';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

describe('EdgesService', () => {
  let service: EdgesService;
  let edgesRepository: Repository<Edge>;
  let rabbitMQService: RabbitMQService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EdgesService,
        {
          provide: getRepositoryToken(Edge),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: RabbitMQService,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EdgesService>(EdgesService);
    edgesRepository = module.get<Repository<Edge>>(getRepositoryToken(Edge));
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  describe('findAll', () => {
    it('should return an array of edges', async () => {
      const result = [new Edge()];
      jest.spyOn(edgesRepository, 'find').mockResolvedValue(result);
      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single edge', async () => {
      const result = new Edge();
      jest.spyOn(edgesRepository, 'findOne').mockResolvedValue(result);
      expect(await service.findOne('test-id')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return an edge', async () => {
      const edge = new Edge();
      edge.node1_alias = 'node1';
      edge.node2_alias = 'node2';
      edge.capacity = 10000;

      jest.spyOn(edgesRepository, 'create').mockReturnValue(edge);
      jest.spyOn(edgesRepository, 'save').mockResolvedValue(edge);
      jest.spyOn(rabbitMQService, 'publish').mockResolvedValue(undefined);

      const result = await service.create('node1', 'node2');
      expect(result).toBe(edge);
      expect(rabbitMQService.publish).toHaveBeenCalled();
    });

    it('should generate capacity between 10000 and 1000000', async () => {
      const mockEdge = {
        id: 'test-id',
        node1_alias: 'node1',
        node2_alias: 'node2',
        capacity: 50000,
        created_at: new Date(),
      };
      
      jest.spyOn(edgesRepository, 'create').mockImplementation((data) => ({
        ...mockEdge,
        ...data
      }));
      jest.spyOn(edgesRepository, 'save').mockResolvedValue(mockEdge);
      jest.spyOn(rabbitMQService, 'publish').mockResolvedValue(undefined);

      const edge = await service.create('node1', 'node2');
      
      expect(edge.capacity).toBeGreaterThanOrEqual(10000);
      expect(edge.capacity).toBeLessThanOrEqual(1000000);
    });

    it('should generate different capacities for different edges', async () => {
      const mockEdge1 = {
        id: 'test-id-1',
        node1_alias: 'node1',
        node2_alias: 'node2',
        capacity: 50000,
        created_at: new Date(),
      };
      const mockEdge2 = {
        id: 'test-id-2',
        node1_alias: 'node3',
        node2_alias: 'node4',
        capacity: 75000,
        created_at: new Date(),
      };

      jest.spyOn(edgesRepository, 'create')
        .mockImplementationOnce((data) => ({
          ...mockEdge1,
          ...data
        }))
        .mockImplementationOnce((data) => ({
          ...mockEdge2,
          ...data
        }));
      jest.spyOn(edgesRepository, 'save')
        .mockResolvedValueOnce(mockEdge1)
        .mockResolvedValueOnce(mockEdge2);
      jest.spyOn(rabbitMQService, 'publish').mockResolvedValue(undefined);

      const edge1 = await service.create('node1', 'node2');
      const edge2 = await service.create('node3', 'node4');
      
      expect(edge1.capacity).not.toBe(edge2.capacity);
    });
  });
});
