import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  findAll() {
    return `This action returns all search`;
  }
}
