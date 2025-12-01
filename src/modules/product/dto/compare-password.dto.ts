/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";

export class ComparePasswordDto {
    @IsString({message: `Must be a string`})
    productId1: string;
    @IsString({message: `Must be a string`})
    productId2: string;
}