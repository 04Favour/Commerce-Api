/* eslint-disable prettier/prettier */
import { IsArray, IsBoolean, IsDefined, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class ProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsString()
    sku?: string;

    @IsMongoId({each: true})
    @IsString({each: true})
    @IsNotEmpty()
    @IsArray()
    categories: string[]

    @IsBoolean()
    @IsDefined()
    @IsOptional()
    isActive: boolean;

    @IsBoolean()
    @IsDefined()
    @IsOptional()
    inStock: boolean;

    @IsNumber()
    @Min(0)
    @IsDefined()
    @IsOptional()
    quantity: number;

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    images: string[]

    @IsOptional()
    @IsObject()
    attributes: Record<string, any>

    @IsOptional()
    @IsObject()
    metadata?: object;
}