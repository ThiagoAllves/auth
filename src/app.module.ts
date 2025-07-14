import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuotesModule } from './quotes/quotes.module';
import { User } from './users/entities/user.entity';
import { Quote } from './quotes/entities/quote.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mudar1020',
      database: 'auth_db',
      entities: [User, Quote],
      synchronize: true, // ❗ use apenas em dev, nunca em produção
    }),
    AuthModule,
    UsersModule,
    QuotesModule,
  ],

})
export class AppModule { }