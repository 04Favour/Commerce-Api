/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '../users/enum/role.enum';
import { ComparePasswordDto } from './dto/compare-password.dto';
import { FilterProductsDto } from '../users/dto/query.dto';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create-product')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() product: ProductDto, @Req() req){
    const userId = req.user.userId
    return await this.productService.createProduct(product, userId)
  }

  @Get('all')
  async getProducts(@Query() query: FilterProductsDto) {
    return await this.productService.getAllProducts(query);
  }

  @Get()
  async comparePassword(@Query() ids: ComparePasswordDto){
    return await this.productService.compareProducts(ids)
  }
}
