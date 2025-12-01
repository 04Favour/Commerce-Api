/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { UserDto } from './dto/user.dto';
import { ProductService } from '../product/product.service';
import { SearchParams } from '../product/dto/search-params.dto';
import { Product } from '../product/schema/product.schema';
import { ComparePasswordDto } from '../product/dto/compare-password.dto';
import { FilterProductsDto } from './dto/query.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly productService: ProductService, private readonly categoryService: CategoryService) {}

    async createUser(userDto: UserDto){
        try{
            const newUser = await this.userModel.create(userDto)
            const {password: _,...rest}= newUser.toObject()  
            return {
                user: rest
            }
        }
        catch(error){
            if (error.code === 11000) throw new ConflictException('User already exists');
            throw new BadRequestException('User not created due to some internal error.')
        }
    }

     async findOneUser(email: string): Promise<UserDocument>{
            const user = await this.userModel.findOne({ email }).exec()
            if (!user) throw new NotFoundException();
            return user
        } 

    async findEmail(email: string) {
        try{
        return await this.userModel.findOne({email})  
        }catch(error){
            if(error === HttpStatus.NOT_FOUND) throw new NotFoundException('User not found');
            Logger.log(`Error Discovered:`, error)
        }   
    }

    async searchProduct({query, page, limit}: SearchParams): Promise<Product[]>{
        return await this.productService.searchProduct({query, page, limit})
    }

    async getAllProducts(query: FilterProductsDto){    
        return await this.productService.getAllProducts(query)
    }

    async getProductById(productId: string){
        return await this.productService.getProductById(productId)
    }

    async compareProducts(ids: ComparePasswordDto){
        return await this.productService.compareProducts(ids)
    }

    productByCategory(categoryId: string){
        return this.productService.getProductsByCategory(categoryId)
    }

    findAllCategories(){
        return this.categoryService.findAll()
    }
    categorybyId(id: string){
        return this.categoryService.findOne(id)
    }

}
