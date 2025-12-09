/* eslint-disable prettier/prettier */
import { IsMongoId, IsNumber, Min } from "class-validator";

export class CartDto {
    @IsMongoId()
    productId: string;

    @Min(1)
    @IsNumber()
    quantity: number
}