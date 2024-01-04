import { Module, forwardRef } from '@nestjs/common';

import { SearchService } from './search.service';
import { NotesModule } from 'src/notes/notes.module';
import { SearchController } from './search.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [forwardRef(() => NotesModule), CommonModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
