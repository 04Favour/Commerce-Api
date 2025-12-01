/* eslint-disable prettier/prettier */
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { UserDto } from "src/modules/users/dto/user.dto";

const omitRole = OmitType(UserDto, ['role'])

export class RegisterDto extends PartialType(omitRole) {
    @IsString()
    @IsNotEmpty()
    fullName: string
    
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
}