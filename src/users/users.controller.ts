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

import { LoginDto } from './dto/login.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import {
  InvalidUserError,
  UserAlreadyExistError,
  WrongPasswordError,
} from 'src/utils/errors/user';

@Controller('api/auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
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

  @Post('login')
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

      return response;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
