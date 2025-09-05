import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UpdateProfileDto } from './dto/profile.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    fileName?: string, // faqat filename saqlaymiz
  ) {
    // 1. Foydalanuvchi mavjudligini tekshirish
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    // 2. Agar yangi fayl kelgan bo‘lsa, eski faylni o‘chirish
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

    // 3. Yangilash
    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: {
        ...dto,
        ...(fileName && { profileImg: fileName }),
      },
    });

    // 4. To‘liq URL qaytarish (front uchun)
    return {
      ...updatedUser,
      profileImg: updatedUser.profileImg
        ? `${updatedUser.profileImg}`
        : null,
    };
  }
}
