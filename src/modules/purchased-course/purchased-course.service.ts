import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaidVia } from '@prisma/client';
import { addMonths } from 'date-fns';
import { HousePaymentDto } from './dto/create-purchased-course.dto'; 

@Injectable()
export class HousePaymentService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Foydalanuvchi email orqali to‘lov qiladi
  async createPayment(payload: HousePaymentDto) {
    const { houseId, email, amount, paidVia } = payload;

    const house = await this.prisma.housess.findUnique({ where: { id: houseId } });
    if (!house) throw new NotFoundException('Uy topilmadi');

    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const exists = await this.prisma.housePayment.findFirst({
      where: { houseId, userId: user.id, status: 'PAID' },
    });
    if (exists) throw new ConflictException('Bu uy uchun allaqachon to‘lov qilingan');

    const data = await this.prisma.housePayment.create({
      data: {
        userId: user.id,
        houseId,
        amount,
        paidVia: paidVia || PaidVia.CASH,
        status: 'PAID',
        paidAt: new Date(),
      },
      include: { user: true, house: true },
    });

    return { status: true, message: 'To‘lov muvaffaqiyatli yaratildi', data };
  }

  async getPaymentsByEmail(email: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const data = await this.prisma.housePayment.findMany({
      where: { userId: user.id },
      include: { house: true },
    });

    return { status: true, message: 'Foydalanuvchi to‘lovlari', data };
  }

  async removeExpiredPayments() {
    const oneMonthAgo = addMonths(new Date(), -1);

    const expired = await this.prisma.housePayment.findMany({
      where: { createdAt: { lt: oneMonthAgo } },
      include: { user: true, house: true },
    });

    if (!expired.length) {
      return { status: true, message: 'Eskirgan to‘lov topilmadi', deleted: 0 };
    }

    for (const item of expired) {
      await this.prisma.housePayment.delete({ where: { id: item.id } });
    }

    return {
      status: true,
      message: 'Eskirgan to‘lovlar o‘chirildi',
      deleted: expired.length,
      data: expired,
    };
  }


  async DeletePurchase(email:string){

    let data = await this.prisma.users.findUnique({
      where:{
        email
      }
    })

    if(!data) {
      throw new NotFoundException("Email not found")
    }


    let top = await this.prisma.housePayment.deleteMany({
      where:{
        userId:data.id
      }
    })

    if(!top){
      throw new ConflictException("User purchased not")
    }



    return {
      status: true,
      message: `Foydalanuvchining ${top.count} ta to‘lovi o‘chirildi`,
    };




  }
}
