import { IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {

    @ApiProperty({
        example: "@example.com",
        description: "Foydalanuvchining telefon raqami, +998 bilan boshlanishi kerak",
    })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: "superPassword123",
        minLength: 8,
        maxLength: 16,
        description: "Foydalanuvchining paroli, 8-16 ta belgidan iborat bo'lishi kerak",
    })
    @IsNotEmpty()
    @IsString()
    @Length(8, 16)
    password: string;

    @ApiProperty({
        example: "Azamjon Faxriddinov",
        minLength: 5,
        maxLength: 50,
        description: "Foydalanuvchining to'liq ismi",
    })
    @IsString()
    @IsNotEmpty()
    @Length(5, 50)
    firstName: string;


    @ApiProperty({
        example: "Azamjon Faxriddinov",
        minLength: 5,
        maxLength: 50,
        description: "Foydalanuvchining to'liq ismi",
    })
    @IsString()
    @IsNotEmpty()
    @Length(5, 50)
    lastName: string;


    @ApiProperty({
        example: "123456",
        description: "Telefon raqamga yuborilgan 6 xonali tasdiqlovchi kod",
    })
    @IsNotEmpty()
    @IsString()
    otp: string;
}
