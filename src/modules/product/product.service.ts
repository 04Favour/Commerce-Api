/* eslint-disable prettier/prettier */
import { BadGatewayException, BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Model } from 'mongoose';
import { ProductDto } from './dto/create-product.dto';
import crypto from 'crypto'
import { UpdateDto } from './dto/update-product.dto';
import { SearchParams } from './dto/search-params.dto';
import { ComparePasswordDto } from './dto/compare-password.dto';
import { ProductResponseDto } from './dto/productResponse.dto';
import { FilterProductsDto } from '../users/dto/query.dto';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entity/category.entity';



@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name)
    constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>, private categoryService: CategoryService){}

    private generateSku(name: string): string {
    // 1. Sanitize the name: convert to uppercase and remove non-alphanumeric chars (except spaces/hyphens)
    const sanitizedName = name.toUpperCase().replace(/[^A-Z0-9\s-]/g, '');

    // 2. Abbreviate the name: Take the first letter of the first three words
    const nameParts = sanitizedName.split(/\s+|-/);
    const abbreviation = nameParts
      .slice(0, 3) // Take max 3 parts
      .map(part => part.charAt(0))
      .join('');

    // 3. Generate a short unique identifier (using a truncated timestamp)
    const uniqueId = Math.floor(Date.now() / 1000).toString(); // Current timestamp in seconds

    // 4. Combine and return the final SKU
    return `${abbreviation}-${uniqueId}`;
  }

   private generateUniqueKey(dto: ProductDto): string {
    const data = {
      name: dto.name?.trim().toLowerCase(),
      attributes: dto.attributes || {},
    };

    return crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }

    async createProduct(productDto: ProductDto, userId: string): Promise<{newProduct: Product}>{
        try{
            const {name, categories} = productDto
            const uniqueKey = this.generateUniqueKey(productDto)
            const existingProduct = await this.productModel.findOne({ uniqueKey }).exec();
            if (existingProduct) {
                throw new ConflictException(
                    'duplicate found.',
                );
            }
            await this.categoryService.validateCategoryIds(categories)
            const newSKU = this.generateSku(name)
            const check = await this.productModel.exists({sku: newSKU}).exec()
            if(check) throw new ConflictException();
             const combinedWithDto = {
                ...productDto,
                sku: newSKU,
                uniqueKey: uniqueKey,
                createdBy: userId
            }
            const newProduct = await this.productModel.create(combinedWithDto)
            return {
                newProduct, 
            }
          }catch(error){
            if (error instanceof ConflictException) throw error;
            this.logger.error(`Error creating product`, error)
            throw new BadGatewayException(`Failure to create product, try again later`)
            }
    }

    async getProductById(productId: string): Promise<Product>{
        const product = await this.productModel.findById(productId).exec()
        if(!product) throw new BadRequestException(`Product ${productId} not found`);
        return product
    }

    async updateProduct(productId: string, dto: UpdateDto, userId: string): Promise<Product>{
      const product = await this.productModel.findById(productId).exec()
      if(!product) throw new NotFoundException(`Product ${productId} does not exist`);
      Object.assign(product, dto, {updatedBy: userId});
      return product.save();
    }

    // async updateProduct(productId: string, dto: UpdateDto, userId: string): Promise<Product>{
    //   const product = await this.productModel.findByIdAndUpdate(productId, {
    //   updatedBy: userId,
    //   ...dto,
    //   updatedAt: new Date()
    //   },{
    //     new: true,
    //     runValidators: true
    //   })
    //   if(!product) throw new BadRequestException(`Product not updated`);
    //   return product;
    // }

    async deleteProduct(productId: string): Promise<Product>{
      const product = await this.productModel.findById(productId).exec()
      if(!product) throw new NotFoundException(`Not found: ${productId}`);
      product.isActive = false;
      return product.save()
    }

    // async getAllProducts(queryParams: QueryParams): Promise<Product[]>{
    //   const { page= 1, limit= 20, ...filterFields } = queryParams;
    //   const skip = (page - 1 ) * limit;
    //   return await this.productModel.find(filterFields).skip(skip).limit(limit).sort({createdAt: -1}).exec()
    // }

    async checkStock(productId: string, quantity: number): Promise<boolean>{
      const product = await this.productModel.findById(productId)
      if(!product) throw new NotFoundException(`Not found product`);
      return product.quantity >= quantity;
    }

    async updateStock(productId: string, quantityChange: number): Promise<Product>{
      const product = await this.productModel.findById(productId)
      if(!product) throw new NotFoundException('Product not found');
      product.quantity += quantityChange
      if(product.quantity < 0) product.quantity = 0;
      return product.save()
    }

    async getProductsByCategory(categoryId: string, page= 1, limit= 20): Promise<Product[]>{
      const skip = (page - 1) * limit;
      try{
        return await this.productModel.find({categories: categoryId}).skip(skip).limit(limit).sort({createdAt: -1}).exec()
      }
      catch(error){ 
        this.logger.error(`Error discovered`, error)
        throw new BadGatewayException();}
    }

    async searchProduct(params: SearchParams): Promise<Product[]>{
      const {query, page = 1, limit = 20} = params

      if(!query || query.trim().length < 2) return [];
      const safeQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      const regex = new RegExp(safeQuery, 'i');
      const filter = {
        $or: [
          {name: {$regex: regex}},
          {sku: {$regex: regex}},
          {description: {$regex: regex}},
        ]
      }
      const safePage = Math.max(1, page)
      const skip = (safePage - 1) * limit;

      return await this.productModel.find(filter).skip(skip).limit(limit).sort({name:1, price: 1}).lean().exec()
    }

    async getAllProducts(query: FilterProductsDto): Promise<Product[]> {
    const {
        page = '1',
        limit = '20',
        search,
        category,
        minPrice,
        maxPrice,
        inStock,
        isActive,
    } = query;

    const filter: any = {};

    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }

    if (category) filter.categories = category;

    if (inStock !== undefined) filter.inStock = inStock === 'true';
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    return this.productModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec();
}


    async compareProducts(id: ComparePasswordDto): Promise<{responseDto1: ProductResponseDto, responseDto2: ProductResponseDto}>{
      const {productId1, productId2} = id
      if (productId1 !== productId2){
        const product1 = await this.productModel.findById(productId1)
        if(!product1) throw new NotFoundException(`Could not find product`);
        const product2 = await this.productModel.findById(productId2)
        if(!product2) throw new NotFoundException('This product could not be found');
        
        const responseDto1 = new ProductResponseDto()
        responseDto1.name = product1.name;
        responseDto1.description = product1.description;
        responseDto1.price = product1.price

        const responseDto2 = new ProductResponseDto()
        responseDto2.name = product2.name;
        responseDto2.description = product2.description;
        responseDto2.price = product2.price;

        return{responseDto1, responseDto2}
      }else {
        throw new BadRequestException(`The ID is the same`)
      }
    }
}
