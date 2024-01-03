import * as Joi from 'joi';
import { Dialect } from 'sequelize';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { applicationConfig } from 'config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';
import { SearchModule } from './search/search.module';

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
    AuthModule,
    NotesModule,
    UsersModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
