import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { QuotesService } from './quotes/quotes.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const quotesService = app.get(QuotesService);

  const hashedPassword = await bcrypt.hash('123456', 10);

  const user = await usersService.create({
    email: 'admin@email.com',
    password: hashedPassword,
  });

  await quotesService.create({
    type: 'Seguro Auto',
    value: 1000,
    userId: user.id,
  });
    console.log('user', user.id);

  await quotesService.create({
    type: 'Seguro Vida',
    value: 2000,
    userId: user.id,
  });

  console.log('✅ Seed concluído com sucesso!');
  await app.close();
}

bootstrap();