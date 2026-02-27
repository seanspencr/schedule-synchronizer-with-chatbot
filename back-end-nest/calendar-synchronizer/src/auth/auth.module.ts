import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from "../jwt/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "../database/database.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const privateKey = configService.get<string>('JWT_PRIVATE');
        const publicKey = configService.get<string>('JWT_PUBLIC');

        if (!privateKey || !publicKey) {
          throw new Error('JWT_PRIVATE and JWT_PUBLIC must be defined in environment variables');
        }

        return {
          privateKey: privateKey.replace(/\\n/g, '\n'),
          publicKey: publicKey.replace(/\\n/g, '\n'),
          signOptions: {
            algorithm: 'RS256',
            expiresIn: '1h',
          },
        };
      },
    }),
    PassportModule,
    UsersModule
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}