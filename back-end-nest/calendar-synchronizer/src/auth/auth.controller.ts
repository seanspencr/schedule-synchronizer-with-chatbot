import { Controller, Get, Post, Req, Res, UseGuards, HttpException, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    private authService: AuthService;
    private jwtService: JwtService;

    constructor(authService: AuthService, jwtService: JwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    // ambil bearer, return user
    @UseGuards(AuthGuard('jwt'))
    @Get("/me")
    me(@Req() req) {
    // return this.authService.getHello();
        console.log("/me hit : " + req.user);
        return req.user;
    }

    //ambil user, return bearer
    @Post("/login")
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto, @Res() res){
        const user = await this.authService.login(loginDto);

        if (!user) {
            throw new HttpException('Invalid credentials', 401);
        }
        
        const token = await this.jwtService.signAsync(user);
        res.cookie('authorization', token, {
                httpOnly: true,
                expires: new Date(new Date().getTime() + 60 * 10 * 1000),
            });

        return res.send(user);
    }        

    @Post("/register/google")
    async registerGoogleUser(@Body() body: {authCode: string, codeVerifier: string, redirectUri: string}){
        const googleAuthCode = body.authCode;
        const codeVerifier = body.codeVerifier;
        const redirectUri = body.redirectUri;
        if(!googleAuthCode || !codeVerifier || !redirectUri){
            throw new HttpException("auth_code, code_verifier, and redirect_uri are required", 400);
        }
        return this.authService.registerGoogleUser(googleAuthCode, codeVerifier, redirectUri);
    }

    @Get("register/google/callback")
    async googleAuthCallback(@Req() req, @Res() res){
        console.log("Google auth callback hit with query:", req.query);
    }

}
