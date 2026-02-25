import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { DatabaseModule } from 'src/database/database.module';
import { SchedulesPipe } from './schedules.pipe';

@Module({
  imports: [DatabaseModule],
  controllers: [SchedulesController],
  providers: [SchedulesService, SchedulesPipe],
})
export class SchedulesModule {}
