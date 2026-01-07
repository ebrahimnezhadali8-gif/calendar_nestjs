import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventRepository } from './events.repository';
import { EventRange, ListEventDto } from './dto/list-event.dto';
import { SearchEventDto } from './dto/search-event.dto';
import { ConflictEventDto } from './dto/conflict-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(private readonly eventRepo: EventRepository) {}

  //ADD
  async addEvent(dto: CreateEventDto) {
    const count = await this.eventRepo.countActiveEvent();
    console.log(count);
    if (count >= 10000) {
      throw new BadRequestException('شما حداکثر رویداد خودتان رو گذاشتین');
    }
    const start = new Date(dto.start);
    const end = new Date(dto.end);

    if (start >= end) {
      throw new BadRequestException(
        'تاریخ پایان باید از تاریخ شروع بیشتر باشد!',
      );
    }
    return this.eventRepo.createEvent(dto);
  }

  //EDIT
  async UpdateEvent(id: number, dto: UpdateEventDto) {
    const exists = await this.eventRepo.existsById(id);
    if (!exists) {
      throw new NotFoundException('رویداد یافت نشد');
    }
    return this.eventRepo.updateEvent(id, dto);
  }

  //REMOVE
  async removeEvent(start: string) {
    const startDate = new Date(start);
    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('فرمت تاریخ اشتباه است');
    }
    return this.eventRepo.DeleteEvent(startDate);
  }

  //lists
  async listEvents(dto: ListEventDto) {
    let startDate: Date;
    let endDate: Date;

    switch (dto.range) {
      //All list Day
      case EventRange.DAY:
        if (!dto.date) {
          throw new BadRequestException('تاریخ الزامی است');
        }

        startDate = new Date(`${dto.date}T00:00:00.000Z`);
        endDate = new Date(`${dto.date}T23:59:59.999Z`);
        break;
      //List now until seven days
      case EventRange.WEEK:
        startDate = new Date();
        endDate = new Date();

        endDate.setUTCDate(endDate.getUTCDate() + 7);
        break;
      //List month
      case EventRange.MONTH:
        if (!dto.month) {
          throw new BadRequestException('تاریخ الزامی است');
        }

        const [year, month] = dto.month.split('-').map(Number);
        startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        endDate = new Date(Date.UTC(year, month - 0, 23, 59, 59, 999));
        break;

      default:
        throw new BadRequestException('نا معتبر است ');
    }
    return this.eventRepo.findDate(startDate, endDate);
  }

  searchEvents(dto: SearchEventDto) {
    return this.eventRepo.searchEvent(dto.q);
  }
  //conflict Day
  async listConflict( dto: ConflictEventDto) {
    if (!dto.date) {
      throw new BadRequestException('تاریخ الزامی است');
    }
    const startDate = new Date(`${dto.date}T00:00:00.000Z`);
    const endDate = new Date(`${dto.date}T23:59:59.999Z`);

    const events = await this.eventRepo.findDate(startDate , endDate);
    console.log(events)
    if(events.length === 0) {
      throw new NotFoundException('هیچ رویداد دارای تداخلی یافت نشد');
    }
    events.sort((a,b)=> a.start.getTime() - b.start.getTime());
    console.log('event : -> ', events)
    const conflict: Event[][] = [];
    let currentGroup: Event[] = [events[0]];
    console.log("conflict : " ,conflict);
    console.log("cuurrrrrrrr: " , currentGroup)

    for (let i = 1 ; i < events.length; i++){
      const prev = currentGroup[currentGroup.length-1];
      const curr = events[i];

      if(curr.start < prev.end){
        currentGroup.push(curr);

      } else{
        if(currentGroup.length > 1){
          conflict.push([...currentGroup]);
          currentGroup = [curr];
        }
      }

      if(currentGroup.length > 1)
        conflict.push([...currentGroup]);

      return conflict
    }
  }
}
