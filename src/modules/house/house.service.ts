import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateHouseDto, QueryHousesDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';


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
export class HouseService {
  constructor(private prisma: PrismaService) {}

  async create(createHouseDto: CreateHouseDto, userId: string, fileName?: string) {
    const payment = await this.prisma.housePayment.findFirst({
      where: {
        userId,
        status: 'PAID',
      },
    });

    let olduser = await this.prisma.users.findFirst({
      where:{
        id:userId
      }
    })

    if(!olduser){
      throw new NotFoundException("User not found")
    }

    if (!payment && olduser.role !=="ADMIN") {
      throw new ForbiddenException('Uy qo‘shish uchun to‘lov qilishingiz kerak');
    }

    const dataToCreate = {
      ...createHouseDto,
      userId,
      ...(fileName && { img: fileName }), 
    };


    let house = await  this.prisma.housess.create({
      data: dataToCreate,
    });

    return {
      ...house,
      features: house.features ? JSON.stringify(house.features) : null,
      extraFeatures: house.extraFeatures ? JSON.stringify(house.extraFeatures) : null,
      documents: house.documents ? JSON.stringify(house.documents) : null,
      id: house.id.toString(),
      categoryId: house.categoryId.toString(), // ✅ BigInt ni stringga o'zgartirish
    };
  }


  async findAll(query: QueryHousesDto) {
    const { limit = 10, offset = 0, title, minPrice, maxPrice, country } = query;
  
    // AND bilan filterlarni tayyorlash
    const whereFilter: any = { isActive: true };
  
    if (title) {
      whereFilter.title = { contains: title, mode: 'insensitive' };
    }
  
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereFilter.price = {};
      if (minPrice !== undefined) whereFilter.price.gte = minPrice;
      if (maxPrice !== undefined) whereFilter.price.lte = maxPrice;
    }
  
    if (country) {
      whereFilter.country = { contains: country, mode: 'insensitive' };
    }
  
    // Uylari olish
    const houses = await this.prisma.housess.findMany({
      where: whereFilter,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        category: true,
      },
      skip: offset,
      take: limit,
    });
  
    const total = await this.prisma.housess.count({ where: whereFilter });
  
    const formattedHouses = convertBigIntToString(houses);
  
    return {
      total,
      data: formattedHouses,
    };
  }
  

  async findAllFull(query: QueryHousesDto) {
    const { limit = 10, offset = 0, title, minPrice, maxPrice, country } = query;
  
    // where filterlarini AND bilan birlashtirish
    const whereFilter: any = { isActive: true };
  
    if (title) {
      whereFilter.title = { contains: title, mode: 'insensitive' };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereFilter.price = {};
      if (minPrice !== undefined) whereFilter.price.gte = minPrice;
      if (maxPrice !== undefined) whereFilter.price.lte = maxPrice;
    }
    if (country) {
      whereFilter.country = { contains: country, mode: 'insensitive' };
    }
  
    // Uylari olish
    const houses = await this.prisma.housess.findMany({
      where: whereFilter,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true },
        },
        category: true,
      },
      skip: offset,
      take: limit,
    });
  
    const total = await this.prisma.housess.count({ where: whereFilter });
  
    const formattedHouses = convertBigIntToString(houses);
  
    return {
      total,
      data: formattedHouses,
    };
  }
  

  async findByUser(userId: string) {
    const houses = await this.prisma.housess.findMany({
      where: { userId: userId }, // agar DB'da userId BIGINT bo'lsa
      include: { category: true },
    });
  
    // BigInt larni stringga aylantirish
    const formattedHouses = convertBigIntToString(houses);
  
    return {
      total: formattedHouses.length,
      data: formattedHouses,
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
  
    const formattedHouses = convertBigIntToString(houses);
  
    return {
      total: formattedHouses.length,
      data: formattedHouses,
    };
  }
  
  async findOne(id: string) {
    const house = await this.prisma.housess.findUnique({
      where: { id: id }, 
      include: { user: true, category: true, location: true },
    });
  
    if (!house) throw new NotFoundException(`House with id ${id} not found`);
  
    const formattedHouse = convertBigIntToString(house);
  
    return formattedHouse;
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
  
    const house = await this.prisma.housess.findUnique({
      where: { id: id }, 
    });
  
    if (!house) throw new NotFoundException(`House with id ${id} not found`);
  
    if (house.userId.toString() !== userId && olduser.role !== 'ADMIN') {
      throw new ForbiddenException('Siz bu uyni o‘zgartira olmaysiz');
    }
  
    const updatedHouse = await this.prisma.housess.update({
      where: { id: id },
      data: { ...dto },
    });
  
    return convertBigIntToString(updatedHouse);
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
      await this.prisma.housess.delete({ where: { id } });
    return {
      succase:true,
      message:"deleted"
    }
  }
}
