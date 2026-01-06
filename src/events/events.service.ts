import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventRepository } from './events.repository';
import { EventRange, ListEventDto } from './dto/list-event.dto';

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

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }
}
