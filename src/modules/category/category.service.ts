import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/create-category.dto'; 
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const exist = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (exist) {
      throw new ConflictException(`Category with name "${dto.name}" already exists`);
    }

    return this.prisma.category.create({ data: dto });
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
      data,
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
      data: dto,
    });
  }

  async remove(id: bigint) {
    const exist = await this.prisma.category.findUnique({ where: { id } });
    if (!exist) throw new NotFoundException(`Category with id ${id} not found`);

    return this.prisma.category.delete({ where: { id } });
  }
}
