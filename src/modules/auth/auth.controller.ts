/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() registerDto: RegisterDto): Promise<{message: string, user: any}>{
    return await this.authService.signup(registerDto)
  }


  @Post('login')
  @HttpCode(HttpStatus.OK)
  async logIn(@Body() loginDto: LoginDto): Promise<{access_token: string}>{
    return await this.authService.signin(loginDto)
  }
}
