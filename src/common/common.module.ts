import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { queues } from 'src/utils/constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: queues.meilisearchQueue,
    }),
  ],
  providers: [],
  exports: [BullModule],
})
export class CommonModule {}
