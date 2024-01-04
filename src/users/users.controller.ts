import {
  Controller,
  Post,
  Body,
  HttpException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';

import { LoginDto } from './dto/login.dto';
import { UsersService } from './users.service';
import { RATE_LIMITER } from '../utils/constants';
import { Public } from '../auth/decorators/public';
import { CreateUserDto } from './dto/create-user.dto';
import { getErrorCodeAndMessage } from '../utils/helpers';
import {
  InvalidUserError,
  UserAlreadyExistError,
  WrongPasswordError,
} from '../utils/errors/user';

@Controller('api/auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('signup')
  @Throttle(
    RATE_LIMITER.MAX_POST_RATE_LIMIT,
    RATE_LIMITER.MAX_POST_RATE_DURATION,
  )
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const { email } = createUserDto;

      const user = await this.usersService.findOne({ email });

      if (user) {
        throw new UserAlreadyExistError();
      }

      await this.usersService.create(createUserDto);

      return 'User Created';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Post('login')
  @Throttle(
    RATE_LIMITER.MAX_POST_RATE_LIMIT,
    RATE_LIMITER.MAX_POST_RATE_DURATION,
  )
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const { email, password } = loginDto;

      const user = await this.usersService.findOne({ email });

      if (!user) {
        throw new InvalidUserError();
      }

      const isValidPassword = await compare(password, user.password);

      if (!isValidPassword) {
        throw new WrongPasswordError();
      }

      const jwtToken = this.usersService.generateToken({
        id: user.id,
        email: user.email,
      });

      res.cookie('access_token', jwtToken.token, {
        maxAge: 24 * 60 * 60 * 1000,
      });

      const response = {
        user,
        accessToken: jwtToken.token,
        expiresIn: jwtToken.expiresIn,
      };

      return res.status(200).send(response);
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
