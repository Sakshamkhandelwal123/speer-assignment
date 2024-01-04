import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';

import { SearchService } from './search.service';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { Throttle } from '@nestjs/throttler';
import { RATE_LIMITER } from 'src/utils/constants';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import { User } from 'src/users/entities/user.entity';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Throttle(RATE_LIMITER.MAX_GET_RATE_LIMIT, RATE_LIMITER.MAX_GET_RATE_DURATION)
  async findAll(
    @CurrentUser() currentUser: User,
    @Query('q') query: string,
  ): Promise<object> {
    try {
      const result = await this.searchService.getSearchResult(
        query,
        currentUser.id,
      );

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
