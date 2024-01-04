import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Note } from './entities/note.entity';
import { UpdateNoteDto } from './dto/update-note.dto';
import { SharedNotesService } from './shared-notes.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note)
    private readonly noteModel: typeof Note,

    private readonly sharedNotesService: SharedNotesService,
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
    return this.noteModel.findOne({
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

  async remove(id: string) {
    const notes = await this.noteModel.destroy({
      where: {
        id,
      },
    });

    await this.sharedNotesService.remove({ noteId: id });

    return notes;
  }
}
