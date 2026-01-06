import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventRepository } from './events.repository';
import { throwIfEmpty } from 'rxjs';

@Injectable()
export class EventsService {
  constructor(private readonly eventRepo: EventRepository) {}

  //ADD
  async addEvent(dto: CreateEventDto) {
    const count = await this.eventRepo.countActiveEvent()
    console.log(count)
    if(count >= 10000){
      throw new BadRequestException('شما حداکثر رویداد خودتان رو گذاشتین')
    }
    const start = new Date(dto.start);
    const end = new Date(dto.end);
    
    if(start >= end){
      throw new BadRequestException('تاریخ پایان باید از تاریخ شروع بیشتر باشد!')
    }
    return this.eventRepo.createEvent(dto);
  }

  //EDIT
  async UpdateEvent(id: number, dto: UpdateEventDto) {
    const exists = await this.eventRepo.existsById(id);
    if(!exists){
      throw new NotFoundException('رویداد یافت نشد')
    }
    return this.eventRepo.updateEvent(id ,dto);
  }

  //REMOVE
  async removeEvent(start: string) {
    const startDate = new Date(start)
    if(isNaN(startDate.getTime())){
      throw new BadRequestException('فرمت تاریخ اشتباه است')
    }
    return this.eventRepo.DeleteEvent(startDate);
  }

  findAll() {
    return `This action returns all events`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

}
