import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PhoneUpdateDto, UpdateProfileDto } from './dto/profile.dto';
import * as fs from 'fs';
import * as path from 'path';
import { EverificationTypes } from 'src/common/types/verification';
import { VerificationService } from '../verification/verification.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService,private verificationService:VerificationService) {}

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    fileName?: string, 
  ) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (fileName && user.profileImg) {
      const oldFilePath = path.join(
        process.cwd(),
        'uploads',
        'profiles',
        user.profileImg,
      );

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: {
        ...dto,
        ...(fileName && { profileImg: fileName }),
      },
    });

    return {
      ...updatedUser,
      profileImg: updatedUser.profileImg
        ? `${updatedUser.profileImg}`
        : null,
    };
  }


  async updatePhone(userId: string, payload: PhoneUpdateDto) {
      
    await  this.verificationService.checkConfirmOtp({type:EverificationTypes.EDIT_PHONE,email:payload.email,otp:payload.otp})
  
    const updated = await this.prisma.users.update({
      where: { id: userId },
      data: { email: payload.email },
    });
  
    return {
      status: true,
      message: "Telefon raqami yangilandi",
      data: updated,
    };
  }
}
