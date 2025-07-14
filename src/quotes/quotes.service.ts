import { Injectable } from '@nestjs/common';
import { Quote } from './entities/quote.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()

export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private quotesRepository: Repository<Quote>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ){

}
  // async create(quoteData: { type: string; value: number; userId: number }) {
  //   // Implement the logic to create a quote, e.g., save to database
  //   // Example:
  //   return this.quotesRepository.save(quoteData);
  
  
  // }


async create(createQuoteDto:  { type: string; value: number; userId: number }): Promise<Quote> {
  const user = await this.usersRepository.findOneBy({ id: createQuoteDto.userId });

  if (!user) {
    throw new Error('User not found');
  }

  const quote = this.quotesRepository.create({
    type: createQuoteDto.type,
    value: createQuoteDto.value,
    user, // associando a ENTIDADE, não apenas o ID
  });


  return this.quotesRepository.save(quote);
}
  async findByUser(id: number) {
    return this.quotesRepository.find({
      where: { user: { id } },
      relations: ['user'],
    });
  }
}