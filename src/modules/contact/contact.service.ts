import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateContactDto } from './dto/create.contact.dtp'; 
import { UpdateContactDto } from './dto/create.contact.dtp'; 
import { QueryContactDto } from './dto/create.contact.dtp'; 
import { Prisma, UserType } from '@prisma/client';
import { AppMailerService } from 'src/common/mailer/mailer.service';


function convertBigIntToString(obj: any): any {
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(convertBigIntToString);
  if (obj && typeof obj === 'object') {
    const res: any = {};
    for (const key in obj) {
      res[key] = convertBigIntToString(obj[key]);
    }
    return res;
  }
  return obj;
}





@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService,private mailerService:AppMailerService) {}

  async create(dto: CreateContactDto,userId:string) {
    let data = await this.prisma.contact.create({
      data: {
        ...dto,
        userId
      },
    });
  
    const house = await this.prisma.housess.findUnique({
      where: { id: dto.houseId },
      include: { user: true }, 
    });
  
    if (!house) {
      throw new NotFoundException('House not found');
    }
  
    const owner = house.user;
  
    await this.mailerService.sendContact({
      firstname: dto.name.split(' ')[0], 
      lastname: dto.name.split(' ')[1] || '', 
      email: dto.email!, 
      mur_email: owner.email, 
      mur_phone:data.phone,
      message: dto.message!,
      date: dto.date.toString(),
      houseName: house.title, 
    });
  
    return { data: convertBigIntToString(data) };
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
      data:convertBigIntToString(data),
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
      data: convertBigIntToString(dto),
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

    let data = await this.prisma.contact.delete({ where: { id } });
    
    return {
      data:convertBigIntToString(data)
    }
  
  }
}
