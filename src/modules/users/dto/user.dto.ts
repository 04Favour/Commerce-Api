/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class UserDto {
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

   @IsString()
   @IsOptional()
   role?: string

   @IsOptional()
   @IsString()
   address?: string

   @IsString()
   @IsOptional()
   phone?: string
}