/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
export class SearchParams {
    @IsNumber()
    @IsOptional()
    @Type(()=> Number)
    @Min(1, { message: 'limit must be at least 1' })
    @IsInt()
    page?: number;

    @IsNumber()
    @IsOptional()
    @Type(()=> Number)
    @Min(1, { message: 'limit must be at least 1' })
    @IsInt()
    limit?: number;

    @IsString()
    query?: string;
}