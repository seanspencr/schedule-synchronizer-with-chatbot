import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import {ConfigModule} from "@nestjs/config";
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath : './.env',
      isGlobal: true,
    }),
      UsersModule,
    SchedulesModule,
    AuthModule,
    DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
