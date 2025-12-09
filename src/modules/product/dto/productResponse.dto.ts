/* eslint-disable prettier/prettier */
import { IsNumberString, IsOptional, IsString } from "class-validator";

export class ProductResponseDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumberString()
    price: number
}