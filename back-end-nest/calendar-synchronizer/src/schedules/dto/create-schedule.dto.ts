import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import type { schedule_recurrencesCreateNestedOneWithoutSchedulesInput, schedulesCreateInput, usersCreateNestedOneWithoutSchedulesInput } from "src/generated/prisma/models";

/* The class CreateScheduleDto implements the schedulesCreateInput interface in TypeScript. */
@ApiSchema()
export class CreateScheduleDto implements schedulesCreateInput{
    id?: string | undefined;

    @ApiProperty({ required: true, default : "meeting" })
    event?: string | null | undefined;

    @ApiProperty({ required: true,  default : "2026-01-01" })
    event_date: string | Date;

    @ApiProperty({ required: false, default : "18:00" })
    start_time?: string | Date | undefined;

    @ApiProperty({ required: false, default : "06:00" })
    end_time?: string | Date | undefined;

    created_at?: string | Date | undefined;
    users: usersCreateNestedOneWithoutSchedulesInput;
    schedule_recurrences?: schedule_recurrencesCreateNestedOneWithoutSchedulesInput | undefined;

}