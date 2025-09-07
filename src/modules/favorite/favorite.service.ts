import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service'; 
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFavoriteDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException(`User with id ${dto.userId} not found`);

    const house = await this.prisma.housess.findUnique({
      where: { id: dto.houseId },
    });
    if (!house) throw new NotFoundException(`House with id ${dto.houseId} not found`);

    return this.prisma.favorite.create({
      data: {
        like: dto.like,
        userId: dto.userId,
        houseId: dto.houseId,
      },
    });
  }



  async updateLike(id: bigint, like: boolean) {
    const exist = await this.prisma.favorite.findUnique({ where: { id } });
    if (!exist) throw new NotFoundException(`Favorite with id ${id} not found`);

    return this.prisma.favorite.update({
      where: { id },
      data: { like },
    });
  }

  async delete(id: bigint) {
    const exist = await this.prisma.favorite.findUnique({ where: { id } });
    if (!exist) throw new NotFoundException(`Favorite with id ${id} not found`);

    return this.prisma.favorite.delete({
      where: { id },
    });
  }
}
