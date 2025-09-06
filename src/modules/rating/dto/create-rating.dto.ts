import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateRatingDto {
  houseId: string;
  cleanLines?: number;
  location?: number;
  accuracy?: number;
}
