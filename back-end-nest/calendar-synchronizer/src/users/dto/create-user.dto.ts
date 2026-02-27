import { ApiProperty } from "@nestjs/swagger";
import { usersCreateInput } from "src/generated/prisma/models";

export class CreateUserDto implements usersCreateInput{
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    email: string;

    @ApiProperty({required: false})
    google_refresh_token?: string | null | undefined;
    @ApiProperty({required: false})
    microsoft_refresh_token?: string | null | undefined;
}
