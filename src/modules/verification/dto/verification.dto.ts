import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { EverificationTypes } from "src/common/types/verification";

export class SendOtpDto {
    @ApiProperty({ enum: EverificationTypes, description: 'Tasdiqlash turi: REGISTER, LOGIN, PASSWORD_RESET va h.k.' })
    @IsNotEmpty()
    @IsEnum(EverificationTypes)
    type: EverificationTypes;

    @ApiProperty({ example: '@example.com', description: 'Foydalanuvchining telefon raqami' })
    @IsEmail()
    email: string;
}

export class VerificationOtpDto {
    @ApiProperty({ example: '123456', description: 'SMS orqali yuborilgan tasdiqlash kodi' })
    @IsString()
    code: string;
}

export class VerifyOtpDto {
    @ApiProperty({ example: 'REGISTER', description: 'Tasdiqlash turi' })
    @IsNotEmpty()
    @IsString()
    type: string;

    @ApiProperty({ example: '@example.com', description: 'Telefon raqami' })
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({ example: '123456', description: 'Tasdiqlash kodi' })
    @IsNotEmpty()
    @IsString()
    otp: string;
}

export class IChekOtp {
    @ApiProperty({ example: 'REGISTER', description: 'Tasdiqlash turi' })
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty({ example: '@example.com', description: 'Telefon raqami (E.164 formatda)' })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456', description: 'Yuborilgan OTP kodi' })
    otp: string;
}
