import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({
    example: true,
    description: 'Like qiymati (true = yoqdi, false = yoqmadi)',
    type: Boolean,
  })
  @IsBoolean()
  like: boolean;

  @ApiProperty({
    example: 'user-uuid-123',
    description: 'Favorite qaysi userga tegishli',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'house-uuid-456',
    description: 'Favorite qaysi housega tegishli',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  houseId: string;
}
