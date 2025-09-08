import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/create-category.dto'; 
import { Prisma } from '@prisma/client';


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
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto, imgUrl?: string, iconUrl?: string) {
    const exist = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (exist) {
      throw new ConflictException(`Category with name "${dto.name}" already exists`);
    }

    const dataToCreate = {
      ...dto,
      ...(imgUrl && { img: imgUrl }),
      ...(iconUrl && { icon: iconUrl }),
    };


      let category = await this.prisma.category.create({ data: dataToCreate });

      return {
        ...category,
        id: category.id.toString(), 
      };
  }

  async findAll(query: QueryCategoryDto) {
    const { name, offset = 0, limit = 10 } = query;

    const where: Prisma.CategoryWhereInput = name
      ? { name: { contains: name, mode: Prisma.QueryMode.insensitive } } // 👈 to‘g‘ri enum ishlatyapmiz
      : {};

    const [total, data] = await this.prisma.$transaction([
      this.prisma.category.count({ where }),
      this.prisma.category.findMany({
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
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException(`Category with id ${id} not found`);
    return category;
  }

  async update(id: bigint, dto: UpdateCategoryDto) {
    const exist = await this.prisma.category.findUnique({ where: { id } });
    if (!exist) throw new NotFoundException(`Category with id ${id} not found`);

    if (dto.name) {
      const duplicate = await this.prisma.category.findUnique({
        where: { name: dto.name },
      });
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException(`Category with name "${dto.name}" already exists`);
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: convertBigIntToString(dto),
    });
  }

  async remove(id: bigint) {
    const exist = await this.prisma.category.findUnique({ where: { id } });
    if (!exist) throw new NotFoundException(`Category with id ${id} not found`);

    let data = await this.prisma.category.delete({ where: { id } });
    

    return {
      data:convertBigIntToString(data)
    }
  
  
  }
}
