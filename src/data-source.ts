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
  entities: [User, Quote],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});