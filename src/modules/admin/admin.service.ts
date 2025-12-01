/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { ProductDto } from '../product/dto/create-product.dto';
import { UpdateDto } from '../product/dto/update-product.dto';
import { CreateCategoryDto } from '../category/dto/create-category.dto';
import { CategoryService } from '../category/category.service';
import { UpdateCategoryDto } from '../category/dto/update-category.dto';
import { ProductDocument } from '../product/schema/product.schema';
import { CategoryDocument } from '../category/entity/category.entity';

@Injectable()
export class AdminService {
    constructor(private readonly productService: ProductService, private readonly categoryService: CategoryService){}

    checkStock(productId: string, quantity: number){
        return this.productService.checkStock(productId, quantity)
    }

    updateStock(productId: string, quantityChange: number){
        return this.productService.updateStock(productId, quantityChange)
    }

    deleteProduct(productId: string){
        return this.productService.deleteProduct(productId)
    }

    createProduct(product: ProductDto, user: string){
        return this.productService.createProduct(product, user)
    }

    updateProduct(productId: string, dto: UpdateDto, user: string){
        return this.productService.updateProduct(productId, dto, user)
    }

    createCategory(dto: CreateCategoryDto): Promise<{category: CategoryDocument}>{
        return this.categoryService.createCategory(dto)
    }

    updateCategory(id: string, dto: UpdateCategoryDto): Promise<{category: CategoryDocument}>{
        return this.categoryService.updateCategory(id, dto)
    }

    removeCategory(id: string): Promise<void>{
        return this.categoryService.removeCategory(id)
    }
}
