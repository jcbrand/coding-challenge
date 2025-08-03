import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { Response } from 'express';

describe('AppController', () => {
  let appController: AppController;
  const mockResponse = {
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should render the landing page HTML', () => {
      appController.getHome(mockResponse);
      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.stringContaining('<!DOCTYPE html>'),
      );
      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.stringContaining('Network Graph API Service'),
      );
    });
  });
});
