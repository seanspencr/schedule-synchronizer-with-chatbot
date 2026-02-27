import { HttpCode, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { check_password, hash_password } from 'src/lib/hash_password';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';
import { GoogleTokenResponse } from './dto/googleToken.dto';
import { usersModel } from 'src/generated/prisma/models';

@Injectable()
export class AuthService {
    private databaseService: DatabaseService;
    private userService: UsersService;
    constructor(databaseService: DatabaseService, userService: UsersService) {
        this.databaseService = databaseService;
        this.userService = userService;
    }

    
    public async login({username, password}: {username: string, password: string}){
        let user : usersModel | undefined | null = await this.databaseService.users.findFirst({
            where: {
                username: username
            }
        });
        
        if (user == null || user == undefined) {
            throw new UnauthorizedException("User not found");
        }

        if(!check_password(password, user.password!)){
            throw new UnauthorizedException("Invalid password");
        }

        
        return user;
    }

    public async register(createUserDto : CreateUserDto){
        return this.userService.create(createUserDto);
    }

    public async registerGoogleUser(googleAuthCode : string,  codeVerifier: string, redirectUri: string){
        // handle token exchange dan get refresh token
        const api_url = "https://oauth2.googleapis.com/token";
        const params = new URLSearchParams();
        params.append("code", googleAuthCode);
        params.append("client_id", process.env.GOOGLE_CLIENT_ID!);
        params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET!);
        params.append("redirect_uri", redirectUri);
        params.append("grant_type", "authorization_code");
        params.append("code_verifier", codeVerifier);

        console.log("Redirect URI:", redirectUri);
        console.log("Exchanging code for token with Google, params:", params.toString());

        try{
            const tokenResponse : GoogleTokenResponse = (await axios.post(api_url, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },})).data;
            console.log("Google token response:", tokenResponse);


            const refreshToken = tokenResponse.refresh_token;
            if(!refreshToken){
                throw new UnauthorizedException("Failed to obtain refresh token from Google");
            }

            // get user info from google
            const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`
                }
            });
            console.log("Google user info response:", userInfoResponse.data);
            const { email, name } = userInfoResponse.data;
            
            return this.userService.createOauthUser({
                email: email,
                password: "null",
                username: name,
                google_refresh_token: refreshToken
            });
            
        }catch(error){
            console.error("Error exchanging code for token:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error request headers:", error.config.headers);
            console.error("Error request data:", error.config.data);
            throw new UnauthorizedException("Failed to exchange code for token with Google");
        }
    }
}
