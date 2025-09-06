import { PaidVia } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsOptional, IsUUID, IsNumber } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class HousePaymentDto {
  @ApiProperty({
    description: "Reklama qilinayotgan uy ID si (UUID formatda)",
    example: "7b9f1e8a-4b2d-4e73-8f33-bf291c4c2c5a",
  })
  @IsUUID()
  @IsNotEmpty()
  houseId: string;

  @ApiProperty({
    description: "To‘lov qilayotgan foydalanuvchi emaili",
    example: "user@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "To‘lov summasi (uy reklama narxi)",
    example: 150.5,
  })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    description: "To‘lov turi (PAYME, CLICK, CASH). Default -> CASH",
    enum: PaidVia,
    example: PaidVia.CASH,
  })
  @IsOptional()
  paidVia?: PaidVia;
}
