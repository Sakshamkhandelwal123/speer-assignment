import { genSalt, hash } from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtPayload, decode, sign } from 'jsonwebtoken';

import { applicationConfig } from '../../config';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { generateUsername } from '../utils/username-generator';
import { validatePasswordStrength } from '../utils/validation-checks';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto, options = {}) {
    const { email, password } = createUserDto;

    validatePasswordStrength(password);

    const hashPassword = await hash(password, await genSalt());

    let username = `sa-${email}`;

    let i = 1;
    while (i <= 5) {
      const uniqueUsername = generateUsername();

      const user = await this.findOne({ username: uniqueUsername });

      if (!user) {
        username = uniqueUsername;
        break;
      }

      i++;
    }

    const payload = {
      ...createUserDto,
      username,
      password: hashPassword,
    };

    return this.userModel.create(payload, options);
  }

  findOne(condition = {}, options = {}) {
    return this.userModel.findOne({
      where: condition,
      ...options,
    });
  }

  generateToken({ id, email }: { id: string; email: string }) {
    const token = sign(
      {
        id,
        email,
      },
      applicationConfig.jwt.secret,
      {
        expiresIn: applicationConfig.jwt.expiresIn,
        algorithm: 'HS256',
        issuer: applicationConfig.jwt.issuer,
      },
    );

    const decodedToken = decode(token) as JwtPayload;

    return {
      token,
      expiresIn: decodedToken.exp - decodedToken.iat,
    };
  }
}
