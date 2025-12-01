/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [MongooseModule.forFeature([{name: Product.name, schema: ProductSchema}]), CategoryModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [MongooseModule, ProductService]
})
export class ProductModule {}
