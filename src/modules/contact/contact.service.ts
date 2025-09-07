import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateContactDto } from './dto/create.contact.dtp'; 
import { UpdateContactDto } from './dto/create.contact.dtp'; 
import { QueryContactDto } from './dto/create.contact.dtp'; 
import { Prisma, UserType } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    return this.prisma.contact.create({
      data: dto,
    });
  }

  async findAll(query: QueryContactDto) {
    const { email, offset = 0, limit = 10 } = query;

    const where: Prisma.ContactWhereInput = email
      ? { email: { contains: email, mode: Prisma.QueryMode.insensitive } }
      : {};

    const [total, data] = await this.prisma.$transaction([
      this.prisma.contact.count({ where }),
      this.prisma.contact.findMany({
        where,
        skip: Number(offset),
        take: Number(limit),
        orderBy: { id: 'desc' },
      }),
    ]);

    return {
      total,
      offset: Number(offset),
      limit: Number(limit),
      data,
    };
  }

  async findOne(id: bigint) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException(`Contact with id ${id} not found`);
    return contact;
  }

  async update(id: bigint, dto: UpdateContactDto, userId: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException(`Contact with id ${id} not found`);

    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User not found`);

    if (contact.userId !== userId && user.role !== UserType.ADMIN) {
      throw new ForbiddenException('Siz bu contactni tahrirlash huquqiga ega emassiz');
    }

    return this.prisma.contact.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: bigint, userId: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException(`Contact with id ${id} not found`);

    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User not found`);

    if (contact.userId !== userId && user.role !== UserType.ADMIN) {
      throw new ForbiddenException('Siz bu contactni o‘chirish huquqiga ega emassiz');
    }

    return this.prisma.contact.delete({ where: { id } });
  }
}
