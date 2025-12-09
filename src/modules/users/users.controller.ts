/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from './enum/role.enum';
import { SearchParams } from '../product/dto/search-params.dto';
import { FilterProductsDto} from './dto/query.dto';
import { ComparePasswordDto } from '../product/dto/compare-password.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createuser(@Body() userDto: UserDto): Promise<{user: any}>{
    return await this.usersService.createUser(userDto)
  }

  @Get('category')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER)
  AllCategories(){
    return this.usersService.findAllCategories()
  }


  @Roles(Role.USER)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req): object {
    return req.user;
  }


  @Roles(Role.USER)
  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchProduct(@Query() param: SearchParams){
    return await this.usersService.searchProduct(param)
  }


  @Roles(Role.USER)
  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getProducts(
  @Query() query: FilterProductsDto) {
  return await this.usersService.getAllProducts(query);
  }

  @Get('get-product/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER)
  async getProductById(@Param('id') id: string){
    return await this.usersService.getProductById(id)
  }

  @Get('compare')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER)
  async compareProducts(@Query() ids: ComparePasswordDto){
    return await this.usersService.compareProducts(ids)
  }

  @Get(':id/category')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER)
  productByCategory(@Param('id') id:string){
    return this.usersService.productByCategory(id)
  }

  @Get('cat/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.USER)
  getByCategoryId(@Param('id') id: string){
    return this.usersService.categorybyId(id)
  }
}
