import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DeleteEventDto } from './dto/delete-event.dto';
import { ListEventDto } from './dto/list-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  add(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.addEvent(createEventDto);
  }

  @Patch(':id')
  edit(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.UpdateEvent(+id, updateEventDto);
  }

  @Delete()
  remove(@Query() dto: DeleteEventDto) {
    return this.eventsService.removeEvent(dto.start);
  }

  @Get()
  list(@Query() dto: ListEventDto) {
    return this.eventsService.listEvents(dto);
  }

  @Get(':id')
  listWeek(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Get(':id')
  listMonth(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }
}
