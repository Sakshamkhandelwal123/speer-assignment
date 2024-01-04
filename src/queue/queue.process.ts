import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { isNull, isUndefined } from 'lodash';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';

import { Note } from 'src/notes/entities/note.entity';
import { NotesService } from 'src/notes/notes.service';
import { SearchService } from 'src/search/search.service';
import { queues, searchAction } from 'src/utils/constants';
import { getErrorCodeAndMessage } from 'src/utils/helpers';

@Processor(queues.meilisearchQueue)
export class MeilisearchQueueProcessor {
  constructor(
    private readonly notesService: NotesService,
    private readonly searchService: SearchService,
  ) {}

  @Process()
  async handleJob(job: Job<unknown>) {
    try {
      const actionType = job.data['actionType'];
      const actionData = job.data['actionData'];

      switch (actionType) {
        case searchAction.ADD_UPDATE_NOTE:
          await this.sendNoteData(actionData);
          break;
        case searchAction.DELETE_NOTE:
          await this.deleteNoteData(actionData);
          break;
      }
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    Logger.log(`Processing job ${job.id} and name ${job.name}`);
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    Logger.log(`Completed job of id ${job.id} and name ${job.name}`);
  }

  @OnQueueError()
  onError(error: Error) {
    Logger.error(error);
  }

  async sendNoteData(actionData: Note) {
    try {
      const note = await this.notesService.findOne(actionData.id);

      if (note) {
        const index = this.searchService.client.index(
          this.searchService.MeiliIndex.NOTE,
        );
        if (isUndefined(index.primaryKey) || isNull(index.primaryKey)) {
          await index.update({
            primaryKey: 'id',
          });
        }

        await index.updateDocuments([actionData]);
      }
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteNoteData(id: string) {
    try {
      const index = this.searchService.client.index(
        this.searchService.MeiliIndex.NOTE,
      );

      await index.deleteDocuments([id]);
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
