import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    
    @ApiProperty({
        example: "@example.com",
        description: "Foydalanuvchining telefon raqami",
    })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        example: "12345678",
        description: "Foydalanuvchining paroli",
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
