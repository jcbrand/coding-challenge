import { Test } from '@nestjs/testing';
import { RabbitMQService } from './rabbitmq.service';
import * as amqp from 'amqp-connection-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Edge } from '../edge.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

jest.mock('amqp-connection-manager');

describe('RabbitMQService', () => {
  let service: RabbitMQService;
  let edgesRepository: Repository<Edge>;
  let logger: jest.Mocked<Logger>;

  beforeEach(async () => {
    // Mock environment variables
    process.env.RABBITMQ_URL = 'amqp://localhost';

    const module = await Test.createTestingModule({
      providers: [
        RabbitMQService,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Edge),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RabbitMQService>(RabbitMQService);
    edgesRepository = module.get<Repository<Edge>>(getRepositoryToken(Edge));
    logger = module.get(Logger);
  });

  afterEach(() => {
    delete process.env.RABBITMQ_URL;
  });

  describe('onModuleInit', () => {
    it('should initialize connection and channel', async () => {
      const mockChannelWrapper = {
        sendToQueue: jest.fn(),
        addSetup: jest.fn(),
      };
      const mockConnection = {
        createChannel: jest.fn().mockReturnValue(mockChannelWrapper),
      };
      (amqp.connect as jest.Mock).mockReturnValue(mockConnection);

      await service.onModuleInit();

      expect(amqp.connect).toHaveBeenCalledWith(['amqp://localhost']);
      expect(mockConnection.createChannel).toHaveBeenCalled();
    });
  });

  describe('publish', () => {
    it('should publish a message', async () => {
      const mockChannelWrapper = {
        sendToQueue: jest.fn().mockResolvedValue(undefined),
        addSetup: jest.fn(),
      };
      const mockConnection = {
        createChannel: jest.fn().mockReturnValue(mockChannelWrapper),
      };
      (amqp.connect as jest.Mock).mockReturnValue(mockConnection);

      await service.onModuleInit();
      const testMessage = { id: 'test-id' };
      await service.publish(testMessage);

      expect(mockChannelWrapper.sendToQueue).toHaveBeenCalledWith(
        'edges_queue',
        Buffer.from(JSON.stringify(testMessage)),
        { deliveryMode: 2 },
      );
    });
  });

  describe('handleEdgeMessage', () => {
    it('should log the correct message format with node aliases and capacity', async () => {
      const testMsg = {
        id: 'test-id',
        node1_alias: 'nodeA',
        node2_alias: 'nodeB',
        capacity: 75000,
      };
      const mockEdge = new Edge();
      mockEdge.node1_alias = 'nodeA';
      mockEdge.node2_alias = 'nodeB';
      mockEdge.capacity = 75000;

      jest.spyOn(edgesRepository, 'findOne').mockResolvedValue(mockEdge);
      jest.spyOn(edgesRepository, 'save').mockResolvedValue(mockEdge);

      await service['handleEdgeMessage'](testMsg);

      expect(logger.log).toHaveBeenCalledWith(
        'New channel between nodeA and nodeB with a capacity of 75000 has been created.',
      );
    });

    it('should update aliases using message values with -updated suffix', async () => {
      const testMsg = {
        id: 'test-id',
        node1_alias: 'original-node1',
        node2_alias: 'original-node2',
        capacity: 50000,
      };
      const mockEdge = new Edge();
      mockEdge.id = 'test-id';
      mockEdge.node1_alias = 'old-node1';
      mockEdge.node2_alias = 'old-node2';

      jest.spyOn(edgesRepository, 'findOne').mockResolvedValue(mockEdge);
      jest.spyOn(edgesRepository, 'save').mockResolvedValue(mockEdge);

      await service['handleEdgeMessage'](testMsg);

      expect(edgesRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          node1_alias: 'original-node1-updated',
          node2_alias: 'original-node2-updated',
        }),
      );
      expect(logger.log).toHaveBeenCalledWith(
        'Updated edge test-id with new aliases',
      );
    });

    it('should log error when processing fails', async () => {
      const testMsg = {
        id: 'test-id',
        node1_alias: 'node1',
        node2_alias: 'node2',
        capacity: 50000,
      };

      jest
        .spyOn(edgesRepository, 'findOne')
        .mockRejectedValue(new Error('DB Error'));

      await expect(service['handleEdgeMessage'](testMsg)).rejects.toThrow();
      expect(logger.error).toHaveBeenCalledWith(
        'Error processing edge message: DB Error',
      );
    });
  });
});
