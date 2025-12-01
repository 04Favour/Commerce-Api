/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '../users/enum/role.enum';
import { ProductDto } from '../product/dto/create-product.dto';
import { UpdateDto } from '../product/dto/update-product.dto';
import { CreateCategoryDto } from '../category/dto/create-category.dto';
import { UpdateCategoryDto } from '../category/dto/update-category.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async checkStock(@Param('id') id: string, @Query('quantity') quantity: number){
  return await this.adminService.checkStock(id, quantity)
    }

  @Patch(':id/update-stock')
  @HttpCode(HttpStatus.OK)
  updateStock(@Param('id') id: string, @Body('quantity') quantity: number){
    return this.adminService.updateStock(id, quantity)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteProduct(@Param('id') id: string){
    return this.adminService.deleteProduct(id)
  }

  @Post('create')
  @HttpCode(HttpStatus.OK)
  createProduct(@Body() product: ProductDto, @Req() req){
    const user = req.user.userId
    return this.adminService.createProduct(product, user)
  }

  @Patch(':id/update-product')
  @HttpCode(HttpStatus.OK)
  updateProduct(@Param('id') id: string, @Body() dto: UpdateDto, @Req() req){
    const user = req.user.userId
    return this.adminService.updateProduct(id, dto, user)
  }

  @Post('create-category')
  @HttpCode(HttpStatus.CREATED)
  createCategory(@Body() dto: CreateCategoryDto){
    return this.adminService.createCategory(dto)
  }

  @Patch(':id/update-category')
  @HttpCode(HttpStatus.OK)
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto){
    return this.adminService.updateCategory(id, dto)
  }

  @Delete(':id/delete-category')
  @HttpCode(HttpStatus.OK)
  deleteCategory(@Param('id') id: string){
    return this.adminService.deleteProduct(id)
  }
}
