import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuotesService } from './quotes.service';

@UseGuards(AuthGuard('jwt')) // Protege a rota
@Controller('quotes')
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @Get()
  async findAll(@Request() req) {
    const userId = req.user.userId; // ID extraído do JWT
    return this.quotesService.findByUser(userId);
  }

  @Post('create')
  async createQuote(@Request() req){
    const userId = req.user.id; // ID extraído do JWT
    const { type, value } = req.body; // Supondo que o corpo da requisição contém esses campos
    return this.quotesService.create({ type, value, userId });
  }
}