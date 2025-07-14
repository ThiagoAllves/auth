import { Injectable } from '@nestjs/common';

@Injectable()
export class QuotesService {
  async create(quoteData: { type: string; value: number; userId: number }) {
    // Implement the logic to create a quote, e.g., save to database
    // Example:
    // return this.quotesRepository.save(quoteData);

    // Placeholder implementation:
    return {
      id: Math.floor(Math.random() * 10000),
      ...quoteData,
    };
  }
  async findByUser(userId: number) {
    return [
      { id: 1, userId, text: 'Seguro de vida' },
      { id: 2, userId, text: 'Seguro residencial' },
    ];
  }
}