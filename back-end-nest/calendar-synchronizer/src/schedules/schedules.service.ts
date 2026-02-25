import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { DatabaseService } from 'src/database/database.service';
import { ApiRequestedRangeNotSatisfiableResponse } from '@nestjs/swagger';

@Injectable()
export class SchedulesService {

  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService){
    this.databaseService = databaseService;
  }

  create(createScheduleDto: CreateScheduleDto) {
    createScheduleDto;
    return this.databaseService.schedules.create({data: createScheduleDto});
  }

  findAllByUser(userId: string) {
    return this.databaseService.schedules.findMany({where: {created_by: userId}});
  }

  findOne(id: string) {
    return this.databaseService.schedules.findUnique({where: {id}});
  }

  update(id: string, updateScheduleDto: UpdateScheduleDto) {
    updateScheduleDto
    return this.databaseService.schedules.update({where: {id}, data: updateScheduleDto});
  }

  remove(id: string) {
    return this.databaseService.schedules.delete({where: {id}});
  }
}
