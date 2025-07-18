import { Test, TestingModule } from '@nestjs/testing';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';

describe('QuotesController', () => {
  let controller: QuotesController;
  let service: QuotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuotesController],
      providers: [
        {
          provide: QuotesService,
          useValue: {
            findByUser: jest.fn().mockResolvedValue([{ id: 2, type: 'life', value: 5000 }]),
            create: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<QuotesController>(QuotesController);
    service = module.get<QuotesService>(QuotesService);
  });
  

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return quotes for authenticated user', async () => {
  const mockReq = {
    user: { userId: 42 },
  };

  const result = await controller.findAll(mockReq);

  expect(service.findByUser).toHaveBeenCalledWith(42);
  expect(result).toEqual([{ id: 2, type: 'life', value: 5000 }]);
});
  
});