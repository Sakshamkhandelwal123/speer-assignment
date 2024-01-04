import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import MeiliSearch, { SearchResponse } from 'meilisearch';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { applicationConfig } from 'config';
import { NotesService } from 'src/notes/notes.service';
import { queues, searchAction } from 'src/utils/constants';
import {
  getErrorCodeAndMessage,
  getMeilliSearchJobId,
} from 'src/utils/helpers';

@Injectable()
export class SearchService {
  client: MeiliSearch;
  isMeiliConnected = false;

  constructor(
    private readonly notesService: NotesService,

    @InjectQueue(queues.meilisearchQueue)
    private readonly meilisearchQueue: Queue,
  ) {
    this.client = new MeiliSearch({
      host: applicationConfig.meiliSearch.host,
      apiKey: applicationConfig.meiliSearch.apikey,
    });

    this.healthCheck();
    this.updateIndexSetting();
  }

  get IndexPrefix() {
    return applicationConfig.app.env.toUpperCase();
  }

  get MeiliIndex() {
    return {
      NOTE: `${this.IndexPrefix}_NOTE`,
    };
  }

  get indexConfigurations() {
    return [
      {
        name: this.MeiliIndex.NOTE,
        settings: {
          searchableAttributes: ['content'],
        },
      },
    ];
  }

  async healthCheck() {
    this.isMeiliConnected = await this.client.isHealthy();

    Logger.log(`Is Meili Connected: ${this.isMeiliConnected}`);

    if (!this.isMeiliConnected) {
      const health = await this.client.health();
      Logger.log(`Meili Health: ${JSON.stringify(health)}`);
    }
  }

  async updateIndexSetting() {
    const promises = this.indexConfigurations.map((row) => {
      const index = this.client.index(row.name);
      return index.updateSettings(row.settings);
    });

    await Promise.all(promises);
  }

  async addUpdateSearch(data: any, actionName: string) {
    await this.meilisearchQueue.add(
      {
        actionData: data,
        actionType: actionName,
      },
      {
        attempts: 3,
        jobId: getMeilliSearchJobId(actionName, data.id),
        removeOnComplete: true,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );
  }

  async deleteSearch(id: string, actionName: string) {
    await this.meilisearchQueue.add(
      {
        actionData: id,
        actionType: actionName,
      },
      {
        attempts: 3,
        delay: 5000,
        jobId: getMeilliSearchJobId(actionName, id),
        removeOnComplete: true,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );
  }

  async deleteAllMeiliData() {
    try {
      const deletePromises = [
        this.client.index(this.MeiliIndex.NOTE).deleteAllDocuments(),
      ];

      await Promise.all(deletePromises);
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async syncMeiliDb() {
    try {
      const notes = await this.notesService.findAll();

      await Promise.all(
        notes.map((note) =>
          this.addUpdateSearch(note, searchAction.ADD_UPDATE_NOTE),
        ),
      );
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getSearchResult(
    keyword: string,
    limit = 10,
    offset = 0,
  ): Promise<SearchResponse<any>> {
    const meiliIndex = this.MeiliIndex['NOTE'];
    const index = this.client.index(meiliIndex);
    return index.search(keyword, { limit, offset });
  }
}
