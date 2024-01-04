import { Module } from '@nestjs/common';

import { NotesModule } from 'src/notes/notes.module';
import { CommonModule } from 'src/common/common.module';
import { SearchModule } from 'src/search/search.module';
import { MeilisearchQueueProcessor } from './queue.process';

@Module({
  imports: [CommonModule, SearchModule, NotesModule],
  providers: [MeilisearchQueueProcessor],
})
export class QueueModule {}
