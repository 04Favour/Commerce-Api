/* eslint-disable prettier/prettier */
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { ProductDto } from "./create-product.dto";

const OmitSkuDto = OmitType(ProductDto, ['sku'])

export class UpdateDto extends PartialType(OmitSkuDto) {}