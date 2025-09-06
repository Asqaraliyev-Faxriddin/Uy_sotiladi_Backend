import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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


export class PhoneUpdateDto {
  
    @ApiProperty({ example: "123456", description: "SMS orqali yuborilgan OTP kodi" })
    @IsNotEmpty()
    @IsString()
    otp: string;
  
    @ApiProperty({ example: "@example.com", description: "Yangi telefon raqami" })
    @IsNotEmpty()
    email: string;
  }

