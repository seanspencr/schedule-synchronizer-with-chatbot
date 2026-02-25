import {ExtractJwt, Strategy} from 'passport-jwt';
import { PassportStrategy} from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as cookieParser from "cookie-parser"
import { AccessTokenPayload } from 'src/auth/dto/accessToken.dto';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    cookieExtract(req) {
        // console.log(req)
        // console.log(req.cookie)
        // console.log(`cookie authorization : ${req.cookies.authorization}`);
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['authorization'];
        }else{
            throw new UnauthorizedException("Please login first");
        }
        return token;
    };

    constructor(configService: ConfigService) {
        const publicKey = configService.get<string>('JWT_PUBLIC');

        if (!publicKey) {
            throw new Error('JWT_PUBLIC must be defined in environment variables');
        }

        super({
            jwtFromRequest: (req) => this.cookieExtract(req),
            ignoreExpiration: false,
            secretOrKey: publicKey.replace(/\\n/g, '\n'),
            algorithms: ['RS256'],
        });
    }

    async validate(payload : AccessTokenPayload): Promise<AccessTokenPayload> {
        // apapun yang lu taro disini, nanti bakal nempel di request.user (.user ini bawaannya si passport)
        return payload;
    }
}