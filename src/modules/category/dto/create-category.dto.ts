import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Apartment', description: 'Kategoriya nomi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Kategoriya rasmi',
    required: false,
  })
  @IsOptional()
  @IsString()
  img?: string;

  @ApiProperty({
    example: '🏠',
    description: 'Kategoriya ikonkasi',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;
}


export class QueryCategoryDto {
    @ApiPropertyOptional({ example: 'Apartment', description: 'Kategoriya nomi bo‘yicha qidirish' })
    @IsOptional()
    @IsString()
    name?: string;
  
    @ApiPropertyOptional({ example: 0, description: 'Qaysi indexdan boshlab olish (offset)' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    offset?: number = 0;
  
    @ApiPropertyOptional({ example: 10, description: 'Nechta yozuv olish (limit)' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 10;
  }