import * as Joi from 'joi';
import { Dialect } from 'sequelize';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { applicationConfig } from 'config';
import { AppService } from './app.service';
import { rateLimit } from './utils/constants';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';
import { QueueModule } from './queue/queue.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { SearchModule } from './search/search.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_DIALECT: Joi.string(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string().allow(''),
        DB_NAME: Joi.string(),
      }),
    }),
    SequelizeModule.forRoot({
      dialect: applicationConfig.database.dialect as Dialect,
      host: applicationConfig.database.host,
      username: applicationConfig.database.username,
      password: applicationConfig.database.password,
      port: parseInt(applicationConfig.database.port, 10),
      database: applicationConfig.database.name,
      logging: false,
      autoLoadModels: true,
      synchronize: false,
    }),
    ThrottlerModule.forRoot({
      ttl: rateLimit.ttl,
      limit: rateLimit.limit,
    }),
    BullModule.forRoot({
      redis: {
        host: applicationConfig.redis.host || 'localhost',
        port: parseInt(applicationConfig.redis.port, 10) || 6379,
      },
    }),
    AuthModule,
    UsersModule,
    NotesModule,
    SearchModule,
    CommonModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
