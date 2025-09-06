import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PhoneUpdateDto, UpdatePasswordDto, UpdateProfileDto } from './dto/profile.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from "bcrypt"
import { EverificationTypes } from 'src/common/types/verification';
import { VerificationService } from '../verification/verification.service';
import { UserType } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService,private verificationService:VerificationService) {}


  async myProfile(id:string){
    console.log("salom");
    
    let data = await this.prisma.users.findFirst({where:{id}})

    if(!data) throw new NotFoundException("User not found")

      
      return {
        succase:true,
        message:"Succase my profile",
        data
      }

    }

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
        firstName: dto.firstName,
        lastName: dto.lastName,
        ...(dto.role && { role: dto.role as UserType }),
        ...(fileName && { profileImg: fileName }),
      },
    });
  
    return {
      ...updatedUser,
      profileImg: updatedUser.profileImg ? `${updatedUser.profileImg}` : null,
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

  async updatePassword(userId: string, payload: UpdatePasswordDto) {
    const { oldPassword, newPassword } = payload;
  
    const user = await this.prisma.users.findFirst({
      where: { id: userId },
    });
  
    if (!user) {
      throw new NotFoundException("User not found");
    }
  
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException("Password incorrect");
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  
    return {
      message: "Succase password updated",
      user: updatedUser,
    };
  }




}
