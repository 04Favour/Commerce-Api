/* eslint-disable prettier/prettier */
import { BadGatewayException, HttpStatus, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService){}
    async signup(registerDto: RegisterDto){
            const {fullName} = registerDto
            const newUser = await this.usersService.createUser(registerDto)
            const {user} = newUser
            const {role: _, ...rest} = user
            return {
                message: `${fullName}, we are happy to have you. You have been signed up`,
                user: rest
            }
    }

    async signin(loginDto: LoginDto): Promise<{access_token: string}>{
        try{
            const {email, password} = loginDto
            const existingUser = await this.usersService.findOneUser(email)
            if(!existingUser || !(await existingUser.comparePassword(password))) throw new UnauthorizedException('Wrong credentials');
            const payload = {username: existingUser.fullName, sub: existingUser._id, role: existingUser.role}
            const access_token = this.jwtService.sign(payload)
            return {
                access_token: access_token
            }
        }
        catch(error){
            if(error === HttpStatus.BAD_GATEWAY){
                throw new BadGatewayException(`Server down temporarily`)
            }
            this.logger.error(`The error discovered`, error)
            throw new InternalServerErrorException()
        }
    }
    
}
