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
} from '@nestjs/common';
import { HouseService } from './house.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/Roles.decorator';
import { UserType } from '@prisma/client';

@ApiTags('Houses')
@ApiBearerAuth()
@UseGuards(AuthGuard,RolesGuard)
@Controller('houses')
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Roles(UserType.ADMIN,UserType.SELL)
  @Post()
  @ApiOperation({ summary: 'Yangi uy qo‘shish (faqat to‘lov qilgan user)' })
  create(@Body() createHouseDto: CreateHouseDto, @Req() req) {
    return this.houseService.create(createHouseDto, req.user.id);
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
