import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Quote } from './entities/quote.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private quotesRepository: Repository<Quote>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  async create(createQuoteDto: { type: string; value: number; userId: number }): Promise<Quote> {
    const user = await this.usersRepository.findOneBy({ id: createQuoteDto.userId });

    if (!user) {
      throw new Error('User not found');
    }

    const quote = this.quotesRepository.create({
      type: createQuoteDto.type,
      value: createQuoteDto.value,
      user,
    });

    const saved = await this.quotesRepository.save(quote);

    // Invalida o cache do usuário
    await this.cacheManager.del(`quotes:user:${createQuoteDto.userId}`);
    return saved;
  }

  async findByUser(id: number): Promise<Quote[]> {
    const cacheKey = `quotes:user:${id}`;

    const cached = await this.cacheManager.get<Quote[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const quotes = await this.quotesRepository.find({
      where: { user: { id } },
      relations: ['user'],
    });
    await this.cacheManager.set(cacheKey, quotes, 120);
    return quotes;
  }
}