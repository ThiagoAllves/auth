import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuotesModule } from './quotes/quotes.module';
import { AppDataSource } from './data-source';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: redisStore,
        host: 'localhost', // ou o host Redis no seu ambiente
        port: 6379,
        ttl: 60, // TTL padrão de 60 segundos
      }),
    }),
    AuthModule,
    UsersModule,
    QuotesModule,
  ],
})
export class AppModule {}