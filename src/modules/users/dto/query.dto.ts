/* eslint-disable prettier/prettier */
import { IsOptional, IsMongoId, IsBooleanString, IsNumberString, IsString } from 'class-validator';

export class FilterProductsDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsMongoId()
    category?: string;

    @IsOptional()
    @IsNumberString()
    minPrice?: string;

    @IsOptional()
    @IsNumberString()
    maxPrice?: string;

    @IsOptional()
    @IsBooleanString()
    inStock?: string;

    @IsOptional()
    @IsBooleanString()
    isActive?: string;

    @IsOptional()
    @IsNumberString()
    page?: string;

    @IsOptional()
    @IsNumberString()
    limit?: string;
}
