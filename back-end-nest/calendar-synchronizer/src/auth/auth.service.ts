import { HttpCode, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { check_password, hash_password } from 'src/lib/hash_password';

@Injectable()
export class AuthService {
    private databaseService: DatabaseService;
    constructor(databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    
    public async login({username, password}: {username: string, password: string}){
        let user = await this.databaseService.users.findFirst({
            where: {
                username: username
            }
        });
        
        if (user == null) {
            throw new UnauthorizedException("User not found");
        }

        if(!check_password(password, user.password)){
            throw new UnauthorizedException("Invalid password");
        }

        
        return user;
    }
}
