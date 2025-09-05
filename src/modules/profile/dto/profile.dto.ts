import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Foydalanuvchining ismi',
    example: 'Ali',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Foydalanuvchining familiyasi',
    example: 'Valiyev',
  })
  @IsOptional()
  @IsString()
  lastName?: string;


  @ApiPropertyOptional({
    description: 'Foydalanuvchining roli',
    example: 'BUY',
    enum: ['BUY', 'SELL'],
  })
  @IsOptional()
  @IsString()
  role?: string;



}