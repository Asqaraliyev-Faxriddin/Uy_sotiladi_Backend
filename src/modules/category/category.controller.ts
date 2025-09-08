import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/create-category.dto'; 
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/Roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserType } from '@prisma/client';
import * as FormData from 'form-data';
import axios from 'axios'
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('Categories')
@Controller('categories')
@ApiBearerAuth()
@UseGuards(AuthGuard,RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'img', maxCount: 1 },
      { name: 'icon', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Yangi kategoriya qo‘shish' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Apartment' },
        img: { type: 'string', format: 'binary', description: 'Kategoriya rasmi (file)' },
        icon: { type: 'string', format: 'binary', description: 'Kategoriya ikonkasi (file)' },
      },
    },
  })
  async create(
    @Body() dto: CreateCategoryDto,
    @UploadedFiles() files?: { img?: Express.Multer.File[]; icon?: Express.Multer.File[] },
  ) {
    let imgUrl: string | undefined;
    let iconUrl: string | undefined;

    if (files?.img?.[0]) {
      const form = new FormData();
      form.append('image', files.img[0].buffer.toString('base64'));

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=7b80af0a58ffc5ed794b3d3955d402c0`,
        form,
        { headers: form.getHeaders() },
      );
      imgUrl = response.data.data.url;
    }

    if (files?.icon?.[0]) {
      const form = new FormData();
      form.append('image', files.icon[0].buffer.toString('base64'));

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=7b80af0a58ffc5ed794b3d3955d402c0`,
        form,
        { headers: form.getHeaders() },
      );
      iconUrl = response.data.data.url;
    }

    return this.categoryService.create(dto, imgUrl, iconUrl);
  }
  @Get()
  @ApiOperation({ summary: 'Get categories with pagination & search' })
  @ApiQuery({ name: 'name', required: false, description: 'Search by category name' })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of categories' })
  findAll(@Query() query: QueryCategoryDto) {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single category by ID' })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(BigInt(id));
  }

  @Roles(UserType.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update category by ID' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category name already exists' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(BigInt(id), updateCategoryDto);
  }

  @Roles(UserType.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(BigInt(id));
  }
}
