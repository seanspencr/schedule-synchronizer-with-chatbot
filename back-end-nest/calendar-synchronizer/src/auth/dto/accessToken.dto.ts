import {ApiProperty} from "@nestjs/swagger";

export class AccessTokenPayload {
    userId: string;
    email: string;
}