import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: '2025-09-07T15:30:00Z', description: 'Date of contact' })
  @IsDateString()
  date: Date;

  @ApiProperty({ example: '15:30', description: 'Time of contact' })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({ example: 'John Doe', description: 'Name of contact person' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+998901234567', description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Interested in this house', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'uuid-of-user', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'uuid-of-house', description: 'House ID' })
  @IsString()
  @IsNotEmpty()
  houseId: string;
}


export class QueryContactDto {
    @ApiPropertyOptional({ example: 'user@example.com', description: 'Search by email' })
    @IsOptional()
    @IsString()
    email?: string;
  
    @ApiPropertyOptional({ example: 0, description: 'Pagination offset' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset?: number = 0;
  
    @ApiPropertyOptional({ example: 10, description: 'Pagination limit' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
  }


export class UpdateContactDto extends PartialType(CreateContactDto) {}