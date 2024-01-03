import { HttpException, HttpStatus } from '@nestjs/common';

export class NoteNotFoundError extends HttpException {
  constructor() {
    super(
      {
        message: 'Note does not exist',
        code: 'NOTE_NOT_FOUND',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class NoteUpdateError extends HttpException {
  constructor() {
    super(
      {
        message: 'You cannot update this note',
        code: 'NOTE_UPDATE',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class NoteDeleteError extends HttpException {
  constructor() {
    super(
      {
        message: 'You cannot delete this note',
        code: 'NOTE_DELETE',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
