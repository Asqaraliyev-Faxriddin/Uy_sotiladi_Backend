import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';

@Injectable()
export class HouseService {
  constructor(private prisma: PrismaService) {}

  async create(createHouseDto: CreateHouseDto, userId: string, fileName?: string) {
    const payment = await this.prisma.housePayment.findFirst({
      where: {
        userId,
        status: 'PAID',
      },
    });

    if (!payment) {
      throw new ForbiddenException('Uy qo‘shish uchun to‘lov qilishingiz kerak');
    }

    const dataToCreate = {
      ...createHouseDto,
      userId,
      ...(fileName && { img: fileName }), 
    };

    return this.prisma.housess.create({
      data: dataToCreate,
    });
  }


  async findAll() {
    const houses = await this.prisma.housess.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        category: true,
      },
    });

    return {
      total: houses.length,
      data: houses,
    };
  }

  async findAllFull() {
    const houses = await this.prisma.housess.findMany({
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true },
        },
        category: true,
      },
    });

    return {
      total: houses.length,
      data: houses,
    };
  }

  async findByUser(userId: string) {
    const houses = await this.prisma.housess.findMany({
      where: { userId },
      include: { category: true },
    });

    return {
      total: houses.length,
      data: houses,
    };
  }

  async query(filter: { email?: string; title?: string; category?: string }) {
    const houses = await this.prisma.housess.findMany({
      where: {
        AND: [
          filter.email
            ? {
                user: {
                  email: { contains: filter.email, mode: 'insensitive' },
                },
              }
            : {},
          filter.title
            ? {
                title: { contains: filter.title, mode: 'insensitive' },
              }
            : {},
          filter.category
            ? {
                category: {
                  name: { contains: filter.category, mode: 'insensitive' },
                },
              }
            : {},
        ],
      },
      include: { user: true, category: true },
    });

    return {
      total: houses.length,
      data: houses,
    };
  }

  async findOne(id: string) {
    const house = await this.prisma.housess.findUnique({
      where: { id },
      include: { user: true, category: true, location: true },
    });
    if (!house) throw new NotFoundException(`House with id ${id} not found`);
    return house;
  }

  async update(id: string, dto: UpdateHouseDto, userId: string) {
    const olduser = await this.prisma.users.findFirst({
      where: {
        id: userId,
      },
    });

    if (!olduser) {
      throw new NotFoundException('User not found');
    }

    const house = await this.prisma.housess.findUnique({ where: { id } });
    if (!house) throw new NotFoundException(`House with id ${id} not found`);
    if (house.userId !== userId && olduser.role !== 'ADMIN') {
      throw new ForbiddenException('Siz bu uyni o‘zgartira olmaysiz');
    }

    return this.prisma.housess.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string, userId: string) {
    const olduser = await this.prisma.users.findFirst({
      where: {
        id: userId,
      },
    });

    if (!olduser) {
      throw new NotFoundException('User not found');
    }

    const house = await this.prisma.housess.findUnique({ where: { id } });
    if (!house) throw new NotFoundException(`House with id ${id} not found`);
    if (house.userId !== userId && olduser.role !== 'ADMIN') {
      throw new ForbiddenException('Siz bu uyni o‘chira olmaysiz');
    }

    return this.prisma.housess.delete({ where: { id } });
  }
}
