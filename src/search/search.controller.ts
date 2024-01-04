import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';

import { SearchService } from './search.service';
import { getErrorCodeAndMessage } from 'src/utils/helpers';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async findAll(@Query('q') query: string): Promise<object> {
    try {
      const result = await this.searchService.getSearchResult(query);

      const searchResponse = {
        limit: result.limit,
        offset: result.offset,
        total: result.estimatedTotalHits,
        notes: result.hits,
      };

      return searchResponse;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
