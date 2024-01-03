import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUserError extends HttpException {
  constructor() {
    super(
      {
        message: 'User does not exist',
        code: 'INVALID_USER',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class WrongPasswordError extends HttpException {
  constructor() {
    super(
      {
        message: 'Password is incorrect',
        code: 'WRONG_PASSWORD',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UserAlreadyExistError extends HttpException {
  constructor() {
    super(
      {
        message: 'User already exist',
        code: 'USER_ALREADY_EXIST',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class WeakPasswordError extends HttpException {
  constructor() {
    super(
      {
        message: 'Password is weak',
        code: 'WEAK_PASSWORD',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class BreachOfPasswordPolicyError extends HttpException {
  constructor() {
    super(
      {
        message: 'Password policy not met',
        code: 'BREACH_OF_PASSWORD_POLICY',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
