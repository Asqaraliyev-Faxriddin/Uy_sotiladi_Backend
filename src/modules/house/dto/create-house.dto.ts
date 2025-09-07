import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHouseDto {
  @ApiPropertyOptional({ example: 'https://picsum.photos/600/400', description: 'Uy rasmi (URL)' })
  @IsOptional()
  @IsString()
  img?: string;

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
  price: number;

  @ApiPropertyOptional({ example: 10000, description: 'Chegirma summasi' })
  @IsOptional()
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
  isActive?: boolean;

  @ApiPropertyOptional({ example: { cadastral: '12345' }, description: 'Hujjatlar (JSON)' })
  @IsOptional()
  documents?: Record<string, any>;

  @ApiProperty({ example: 'user-uuid-123', description: 'User ID (kim joylagan)' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 1, description: 'Kategoriya ID' })
  @IsNotEmpty()
  categoryId: number;
}
