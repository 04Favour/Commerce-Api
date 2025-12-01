/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './entity/category.entity';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import slugify from 'slugify';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    private logger = new Logger(CategoryService.name)
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>){}

    async createCategory(dto: CreateCategoryDto): Promise<{category: CategoryDocument}>{
        const {name} = dto
        const slug = slugify(name, {lower: true})
        const existing = await this.categoryModel.findOne({name})
        if(existing)throw new ConflictException(`Category with name: ${name} exists`);
        const create = await this.categoryModel.create({
            ...dto,
            slug
        })
        return {
            category: create
        }
    }

    async findAll(): Promise<CategoryDocument[]>{
        return await this.categoryModel.find().sort({createdAt: -1}).exec()
    }

    async findOne(id: string): Promise<{category: CategoryDocument}>{
        const category = await this.categoryModel.findById(id)
        if(!category) throw new NotFoundException(`Id: ${id} not found`);
        return {category: category}
    }

    async updateCategory(id: string, dto:UpdateCategoryDto): Promise<{category: CategoryDocument}>{
        const existing = await this.categoryModel.findById(id)
        if(!existing) throw new NotFoundException();
        try{
            const update = await this.categoryModel.findByIdAndUpdate(id, dto, { new: true, runValidators: true }).exec()
            if(!update) throw new NotFoundException(`Id: ${id} not found`);
            return {
                category: update
            }
        }catch(error){
            this.logger.error(`Error discovered`, error.code)
            throw new BadRequestException()
        }
        
    }

    async removeCategory(id: string): Promise<void>{
        const deleteCategory = await this.categoryModel.findByIdAndDelete(id)
        if(!deleteCategory) throw new BadRequestException();
    }

    async validateCategoryIds(ids: string[]): Promise<void> {
    if (!ids || ids.length === 0) return;
    const categoriesCount = ids.length;
    const existingCategoriesCount = await this.categoryModel.countDocuments({
      _id: { $in: ids }, 
    }).exec();
    if (existingCategoriesCount !== categoriesCount) {
      throw new NotFoundException('One or more categories in the list were not found.');
    }
  }
}
