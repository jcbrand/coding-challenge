import { Test } from '@nestjs/testing';
import { RabbitMQService } from './rabbitmq.service';
import * as amqp from 'amqp-connection-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Edge } from '../edge.entity';
import { Repository } from 'typeorm';

jest.mock('amqp-connection-manager');

describe('RabbitMQService', () => {
  let service: RabbitMQService;
  let edgesRepository: Repository<Edge>;

  beforeEach(async () => {
    // Mock environment variables
    process.env.RABBITMQ_URL = 'amqp://localhost';

    const module = await Test.createTestingModule({
      providers: [
        RabbitMQService,
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
        { deliveryMode: 2 }
      );
    });
  });

  describe('handleEdgeMessage', () => {
    it('should update and save edge', async () => {
      const edge = new Edge();
      edge.node1_alias = 'node1';
      edge.node2_alias = 'node2';
      jest.spyOn(edgesRepository, 'findOne').mockResolvedValue(edge);
      jest.spyOn(edgesRepository, 'save').mockResolvedValue(edge);

      await service['handleEdgeMessage']({ id: 'test-id' });
      expect(edgesRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          node1_alias: 'node1-updated',
          node2_alias: 'node2-updated',
        }),
      );
    });
  });
});
