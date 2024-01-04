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

export class NoteShareError extends HttpException {
  constructor() {
    super(
      {
        message: 'You cannot share this note',
        code: 'NOTE_SHARE',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ReadPermissionError extends HttpException {
  constructor() {
    super(
      {
        message: 'You do not have the permission to read this note',
        code: 'READ_PERMISSION',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
