import { Test, TestingModule } from '@nestjs/testing';
import { QuotesService } from './quotes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Quote } from './entities/quote.entity';
import { User } from '../users/entities/user.entity';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

describe('QuotesService', () => {
  let service: QuotesService;
  let quotesRepo: jest.Mocked<Repository<Quote>>;
  let usersRepo: jest.Mocked<Repository<User>>;
  let cacheManager: jest.Mocked<Cache>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotesService,
        {
          provide: getRepositoryToken(Quote),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(QuotesService);
    quotesRepo = module.get(getRepositoryToken(Quote));
    usersRepo = module.get(getRepositoryToken(User));
    cacheManager = module.get('CACHE_MANAGER');
  });

  it('should return quotes from cache if available', async () => {
    const fakeQuotes = [{ id: 1, type: 'car', value: 1000 }] as Quote[];
    cacheManager.get.mockResolvedValue(fakeQuotes);

    const result = await service.findByUser(1);

    expect(cacheManager.get).toHaveBeenCalledWith('quotes:user:1');
    expect(quotesRepo.find).not.toHaveBeenCalled();
    expect(result).toEqual(fakeQuotes);
  });

  it('should fetch from DB and cache if not in cache', async () => {
    cacheManager.get.mockResolvedValue(undefined);
    const dbQuotes = [{ id: 2, type: 'life', value: 5000 }] as Quote[];

    quotesRepo.find.mockResolvedValue(dbQuotes);

    const result = await service.findByUser(2);

    expect(cacheManager.get).toHaveBeenCalledWith('quotes:user:2');
    expect(quotesRepo.find).toHaveBeenCalledWith({
      where: { user: { id: 2 } },
      relations: ['user'],
    });
    expect(cacheManager.set).toHaveBeenCalledWith('quotes:user:2', dbQuotes, 120);
    expect(result).toEqual(dbQuotes);
  });

  it('should invalidate cache when creating a quote', async () => {
    const user = { id: 3 } as User;
    const newQuote = { type: 'home', value: 2000, user } as Quote;

    usersRepo.findOneBy.mockResolvedValue(user);
    quotesRepo.create.mockReturnValue(newQuote);
    quotesRepo.save.mockResolvedValue(newQuote);

    const result = await service.create({ type: 'home', value: 2000, userId: 3 });

    expect(usersRepo.findOneBy).toHaveBeenCalledWith({ id: 3 });
    expect(quotesRepo.create).toHaveBeenCalledWith({
      type: 'home',
      value: 2000,
      user,
    });
    expect(quotesRepo.save).toHaveBeenCalledWith(newQuote);
    expect(cacheManager.del).toHaveBeenCalledWith('quotes:user:3');
    expect(result).toEqual(newQuote);
  });
  it('should throw an error if user is not found when creating quote', async () => {
    usersRepo.findOneBy.mockResolvedValue(null); // Simula usuário inexistente

    await expect(
      service.create({ type: 'life', value: 3000, userId: 999 })
    ).rejects.toThrow('User not found');

    expect(usersRepo.findOneBy).toHaveBeenCalledWith({ id: 999 });
    expect(quotesRepo.create).not.toHaveBeenCalled();
    expect(quotesRepo.save).not.toHaveBeenCalled();
    expect(cacheManager.del).not.toHaveBeenCalled();
  });
});