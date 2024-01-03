import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Note } from './entities/note.entity';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note)
    private readonly noteModel: typeof Note,
  ) {}

  create(payload = {}) {
    return this.noteModel.create(payload);
  }

  findAll(condition = {}, options = {}) {
    return this.noteModel.findAll({
      where: condition,
      ...options,
    });
  }

  findOne(condition = {}, options = {}) {
    return this.noteModel.findAll({
      where: condition,
      ...options,
    });
  }

  update(id: string, updateNoteDto: UpdateNoteDto) {
    return this.noteModel.update(updateNoteDto, {
      where: {
        id,
      },
      returning: true,
    });
  }

  remove(id: string) {
    return this.noteModel.destroy({
      where: {
        id,
      },
    });
  }
}
