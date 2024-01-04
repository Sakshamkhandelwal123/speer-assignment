import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Note } from './entities/note.entity';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { SearchModule } from 'src/search/search.module';
import { SharedNote } from './entities/shared-note.entity';
import { SharedNotesService } from './shared-notes.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Note, SharedNote]),
    forwardRef(() => SearchModule),
  ],
  controllers: [NotesController],
  providers: [NotesService, SharedNotesService],
  exports: [NotesService, SharedNotesService],
})
export class NotesModule {}
