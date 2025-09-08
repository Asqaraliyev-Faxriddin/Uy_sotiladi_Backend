import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as FormData from 'form-data';
import axios from 'axios';
import { HouseService } from './house.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/Roles.decorator';
import { UserType } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Houses')
@ApiBearerAuth()
@UseGuards(AuthGuard,RolesGuard)
@Controller('houses')
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Roles(UserType.ADMIN, UserType.SELL)
  @Post()
  @UseInterceptors(FileInterceptor('img'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Yangi uy qo‘shish (faqat to‘lov qilgan user)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        img: { type: 'string', format: 'binary', description: 'Uy rasmi (file upload)' },
        title: { type: 'string', example: 'Modern Apartment' },
        address: { type: 'string', example: 'Chilonzor, Toshkent' },
        country: { type: 'string', example: 'Uzbekistan' },
        price: { type: 'number', example: 150000 },
        discount: { type: 'number', example: 10000 },
        build_year: { type: 'string', example: '2020-01-01T00:00:00.000Z' },
        description: { type: 'string', example: 'Chiroyli kvartira' },
        features: { type: 'object', example: { rooms: 3, bathrooms: 2 } },
        extraFeatures: { type: 'object', example: { parking: true, pool: false } },
        isActive: { type: 'boolean', example: true },
        documents: { type: 'object', example: { cadastral: '12345' } },
        categoryId: { type: 'number', example: 1 },
      },
    },
  })
  async create(
    @Body() dto: CreateHouseDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?,
  ) {
    let uploadedUrl: string | undefined;

    if (file) {
      const form = new FormData();
      form.append('image', file.buffer.toString('base64'));

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=7b80af0a58ffc5ed794b3d3955d402c0`,
        form,
        { headers: form.getHeaders() },
      );

      uploadedUrl = response.data.data.url;
    }

    return this.houseService.create(dto, req.user.id, uploadedUrl);
  }
  
  @Get()
  @ApiOperation({ summary: 'Aktiv uylardan ro‘yxat (oddiy foydalanuvchi)' })
  findAll() {
    return this.houseService.findAll();
  }

  @Roles(UserType.ADMIN)
  @Get('all/full')
  @ApiOperation({ summary: 'Barcha uylardan ro‘yxat (Admin)' })
  findAllFull() {
    return this.houseService.findAllFull();
  }

  @Get('my')
  @ApiOperation({ summary: 'Userning o‘z uylari' })
  findByUser(@Req() req) {
    return this.houseService.findByUser(req.user.id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Uylardan qidirish (email, title, category bo‘yicha)' })
  query(
    @Query('email') email?: string,
    @Query('title') title?: string,
    @Query('category') category?: string,
  ) {
    return this.houseService.query({ email, title, category });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta uy ma’lumotini olish' })
  findOne(@Param('id') id: string) {
    return this.houseService.findOne(id);
  }

  @Roles(UserType.ADMIN,UserType.SELL)
  @Patch(':id')
  @ApiOperation({ summary: 'Uy ma’lumotini yangilash' })
  update(@Param('id') id: string, @Body() updateHouseDto: UpdateHouseDto, @Req() req) {
    return this.houseService.update(id, updateHouseDto, req.user.id);
  }

  @Roles(UserType.ADMIN,UserType.SELL)
  @Delete(':id')
  @ApiOperation({ summary: 'Uy o‘chirish' })
  remove(@Param('id') id: string, @Req() req) {
    return this.houseService.remove(id, req.user.id);
  }
}
