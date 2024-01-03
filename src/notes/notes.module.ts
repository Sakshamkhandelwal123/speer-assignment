import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Note } from './entities/note.entity';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { SharedNote } from './entities/shared-note.entity';
import { SharedNotesService } from './shared-notes.service';

@Module({
  imports: [SequelizeModule.forFeature([Note, SharedNote])],
  controllers: [NotesController],
  providers: [NotesService, SharedNotesService],
})
export class NotesModule {}
