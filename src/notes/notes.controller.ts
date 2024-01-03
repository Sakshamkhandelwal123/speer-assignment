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
} from 'src/utils/errors/note';

@Controller('api/notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly sharedNotesService: SharedNotesService,
  ) {}

  @Post()
  create(
    @CurrentUser() currentUser: User,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    try {
      const payload = {
        createdBy: currentUser.id,
        ...createNoteDto,
      };

      return this.notesService.create(payload);
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post(':id/share')
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
  async findOne(@CurrentUser() currentUser: User, @Param('id') id: string) {
    try {
      const note = await this.notesService.findOne({
        id,
        createdBy: currentUser.id,
      });

      if (!note) {
        throw new NoteNotFoundError();
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

      return updatedNote[1][0];
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
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

      return 'Note deleted successfully';
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
