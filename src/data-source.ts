import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Quote } from './quotes/entities/quote.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'mudar1020',
  database: 'auth_db',
  synchronize: false, // Nunca usar true em produção
  logging: false,
  entities: [User, Quote],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
