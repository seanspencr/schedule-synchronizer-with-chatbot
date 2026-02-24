import { ApiProperty } from "@nestjs/swagger";
import { usersCreateInput } from "src/generated/prisma/models";

export class CreateUserDto implements usersCreateInput{
    @ApiProperty()
    username?: string | null | undefined;
    @ApiProperty()
    password?: string | undefined;
}
