import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty()
  houseId: string;

  @ApiPropertyOptional()
  cleanLines?: number;

  @ApiPropertyOptional()
  location?: number;
  
  @ApiPropertyOptional()
  accuracy?: number;
}
