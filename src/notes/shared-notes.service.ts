import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SharedNote } from './entities/shared-note.entity';

@Injectable()
export class SharedNotesService {
  constructor(
    @InjectModel(SharedNote)
    private readonly sharedNoteModel: typeof SharedNote,
  ) {}

  create(payload = {}) {
    return this.sharedNoteModel.create(payload);
  }

  findOne(condition = {}, options = {}) {
    return this.sharedNoteModel.findOne({
      where: condition,
      ...options,
    });
  }
}
