import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AuthGuard } from '@nestjs/passport';
import { SchedulesPipe } from './schedules.pipe';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body(SchedulesPipe) createScheduleDto: CreateScheduleDto, @Req() req) {
    createScheduleDto.users = {connect: {id: req.user.id}};
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req) {
    return this.schedulesService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @Req() req) {
    let scheduleDetail = await this.schedulesService.findOne(id); 
    if(scheduleDetail === null){
      throw new HttpException('Not Found', 404);
    }

    if(scheduleDetail.created_by !== req.user.id){
      throw new HttpException('Forbidden', 403);
    }
    
    return scheduleDetail;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body(SchedulesPipe) updateScheduleDto: UpdateScheduleDto, @Req() req) {
    let scheduleDetail = await this.schedulesService.findOne(id); 
    if(scheduleDetail === null){
      throw new HttpException('Not Found', 404);
    }

    if(scheduleDetail.created_by !== req.user.id){
      throw new HttpException('Forbidden', 403);
    }

    return this.schedulesService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req) {
    let scheduleDetail = await this.schedulesService.findOne(id); 
    if(scheduleDetail === null){
      throw new HttpException('Not Found', 404);
    }

    if(scheduleDetail.created_by !== req.user.id){
      throw new HttpException('Forbidden', 403);
    }

    return this.schedulesService.remove(id);
  }
}
