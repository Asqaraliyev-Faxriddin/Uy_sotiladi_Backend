import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateHouseDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'Uy rasmi (file yuklash uchun)' })
  @IsOptional()
  img?: any; 

  @ApiProperty({ example: 'Modern Apartment', description: 'Uy nomi' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Chilonzor, Toshkent', description: 'Manzil' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ example: 'Uzbekistan', description: 'Mamlakat' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 150000, description: 'Uy narxi' })
  @IsNumber()
  @Type(()=> Number)
  price: number;

  @ApiPropertyOptional({ example: 10000, description: 'Chegirma summasi' })
  @IsOptional()
  @Type(()=> Number)
  @IsNumber()
  discount?: number;

  @ApiPropertyOptional({ example: '2020-01-01T00:00:00.000Z', description: 'Qurilgan yil' })
  @IsOptional()
  build_year?: Date;

  @ApiPropertyOptional({ example: 'Chiroyli, zamonaviy kvartira', description: 'Tavsif' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: { rooms: 3, bathrooms: 2 }, description: 'Asosiy xususiyatlar (JSON)' })
  @IsOptional()
  features?: Record<string, any>;

  @ApiPropertyOptional({ example: { parking: true, pool: false }, description: 'Qo‘shimcha xususiyatlar (JSON)' })
  @IsOptional()
  extraFeatures?: Record<string, any>;

  @ApiPropertyOptional({ example: true, description: 'Aktivligi' })
  @IsOptional()
  @IsBoolean()
  @Type(()=> Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ example: { cadastral: '12345' }, description: 'Hujjatlar (JSON)' })
  @IsOptional()
  documents?: Record<string, any>;

  @ApiProperty({ example: 1, description: 'Kategoriya ID' })
  @IsNotEmpty()
  categoryId: number;
}




export class QueryHousesDto {
  @ApiPropertyOptional({ description: 'Nechta elementdan keyin boshlash', example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({ description: 'Olish kerak bo‘lgan uylar soni', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ description: 'Uy nomi bo‘yicha qidirish', example: 'Olmazor' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Minimal narx', example: 100000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maksimal narx', example: 500000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Mamlakat bo‘yicha filter', example: 'Uzbekistan' })
  @IsOptional()
  @IsString()
  country?: string;
}