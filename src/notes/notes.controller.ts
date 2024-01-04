import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';

import { NotesService } from './notes.service';
import { ShareNoteDto } from './dto/share-note.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { User } from 'src/users/entities/user.entity';
import { getErrorCodeAndMessage } from 'src/utils/helpers';
import { SharedNotesService } from './shared-notes.service';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import {
  NoteDeleteError,
  NoteNotFoundError,
  NoteShareError,
  NoteUpdateError,
  ReadPermissionError,
} from 'src/utils/errors/note';
import { SearchService } from 'src/search/search.service';
import { RATE_LIMITER, searchAction } from 'src/utils/constants';
import { Throttle } from '@nestjs/throttler';

@Controller('api/notes')
export class NotesController {
  constructor(
    private readonly searchService: SearchService,
    private readonly notesService: NotesService,
    private readonly sharedNotesService: SharedNotesService,
  ) {}

  @Post()
  @Throttle(
    RATE_LIMITER.MAX_POST_RATE_LIMIT,
    RATE_LIMITER.MAX_POST_RATE_DURATION,
  )
  async create(
    @CurrentUser() currentUser: User,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    try {
      const payload = {
        createdBy: currentUser.id,
        ...createNoteDto,
      };

      const newNote = await this.notesService.create(payload);

      await this.searchService.addUpdateSearch(
        newNote,
        searchAction.ADD_UPDATE_NOTE,
      );

      return newNote;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post(':id/share')
  @Throttle(
    RATE_LIMITER.MAX_POST_RATE_LIMIT,
    RATE_LIMITER.MAX_POST_RATE_DURATION,
  )
  async shareNote(
    @CurrentUser() currentUser: User,
    @Param('id') id: string,
    @Body() shareNoteDto: ShareNoteDto,
  ) {
    try {
      const note = await this.notesService.findOne({
        id,
        createdBy: currentUser.id,
      });

      if (!note) {
        throw new NoteShareError();
      }

      await this.sharedNotesService.create({
        noteId: id,
        ownerId: currentUser.id,
        sharedUserId: shareNoteDto.sharedUserId,
      });

      return 'Note shared successfully';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @Throttle(RATE_LIMITER.MAX_GET_RATE_LIMIT, RATE_LIMITER.MAX_GET_RATE_DURATION)
  findAll(@CurrentUser() currentUser: User) {
    try {
      return this.notesService.findAll({ createdBy: currentUser.id });
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  @Throttle(RATE_LIMITER.MAX_GET_RATE_LIMIT, RATE_LIMITER.MAX_GET_RATE_DURATION)
  async findOne(@CurrentUser() currentUser: User, @Param('id') id: string) {
    try {
      const note = await this.notesService.findOne({
        id,
      });

      if (!note) {
        throw new NoteNotFoundError();
      }

      if (note.createdBy !== currentUser.id) {
        const isAccess = await this.sharedNotesService.findOne({
          sharedUserId: currentUser.id,
        });

        if (!isAccess) {
          throw new ReadPermissionError();
        }
      }

      return note;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  @Throttle(
    RATE_LIMITER.MAX_POST_RATE_LIMIT,
    RATE_LIMITER.MAX_POST_RATE_DURATION,
  )
  async update(
    @CurrentUser() currentUser: User,
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    try {
      const note = await this.notesService.findOne({
        id,
        createdBy: currentUser.id,
      });

      if (!note) {
        throw new NoteUpdateError();
      }

      const updatedNote = await this.notesService.update(id, updateNoteDto);

      await this.searchService.addUpdateSearch(
        updatedNote[1][0],
        searchAction.ADD_UPDATE_NOTE,
      );

      return updatedNote[1][0];
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @Throttle(
    RATE_LIMITER.MAX_POST_RATE_LIMIT,
    RATE_LIMITER.MAX_POST_RATE_DURATION,
  )
  async remove(@CurrentUser() currentUser: User, @Param('id') id: string) {
    try {
      const note = await this.notesService.findOne({
        id,
        createdBy: currentUser.id,
      });

      if (!note) {
        throw new NoteDeleteError();
      }

      await this.notesService.remove(id);

      await this.searchService.deleteSearch(id, searchAction.DELETE_NOTE);

      return 'Note deleted successfully';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
