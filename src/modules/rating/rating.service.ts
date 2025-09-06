import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateRatingDto) {
    const { houseId, cleanLines, location, accuracy } = dto;

    const user = await this.prisma.users.findFirst({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const house = await this.prisma.housess.findFirst({ where: { id: houseId } });
    if (!house) throw new NotFoundException('House not found');

    const oldRating = await this.prisma.rating.findFirst({
      where: { houseId, userId },
    });
    if (oldRating) {
      throw new ForbiddenException('You have already rated this house');
    }

    return await this.prisma.rating.create({
      data: {
        houseId,
        userId,
        cleanLines,
        location,
        accuracy,
      },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, role: true } },
        house: true,
      },
    });
  }

  async findAllLatest() {
    return await this.prisma.rating.findMany({
      orderBy: { id: 'desc' },
      take: 10,
      include: {
        house: true,
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  }

  async findAllBy(houseId: string, offset = 0, limit = 10) {
    const house = await this.prisma.housess.findFirst({ where: { id: houseId } });
    if (!house) throw new NotFoundException('House not found');

    return await this.prisma.rating.findMany({
      where: { houseId },
      skip: offset,
      take: limit,
      orderBy: { id: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, role: true, email: true } },
      },
    });
  }

  async getAnalytics(houseId: string) {
    const house = await this.prisma.housess.findFirst({ where: { id: houseId } });
    if (!house) throw new NotFoundException('House not found');

    const ratings = await this.prisma.rating.findMany({ where: { houseId } });
    const total = ratings.length;

    if (total === 0) {
      return {
        averageCleanLines: 0,
        averageLocation: 0,
        averageAccuracy: 0,
        totalRatings: 0,
      };
    }

    const avgCleanLines = ratings.reduce((s, r) => s + (r.cleanLines || 0), 0) / total;
    const avgLocation = ratings.reduce((s, r) => s + (r.location || 0), 0) / total;
    const avgAccuracy = ratings.reduce((s, r) => s + (r.accuracy || 0), 0) / total;

    return {
      averageCleanLines: +avgCleanLines.toFixed(2),
      averageLocation: +avgLocation.toFixed(2),
      averageAccuracy: +avgAccuracy.toFixed(2),
      totalRatings: total,
    };
  }

  async remove(id: number) {
    const rating = await this.prisma.rating.findFirst({ where: { id } });
    if (!rating) throw new NotFoundException('Rating not found');

    await this.prisma.rating.delete({ where: { id } });
    return { message: 'Rating deleted successfully' };
  }

async update(userId: string, id: number, dto: Partial<CreateRatingDto>) {
  const rating = await this.prisma.rating.findFirst({
    where: { id: id, userId },
  });
  if (!rating) throw new NotFoundException('Rating not found or not yours');

  return await this.prisma.rating.update({
    where: { id: id },
    data: {
      ...(dto.cleanLines !== undefined && { cleanLines: dto.cleanLines }),
      ...(dto.location !== undefined && { location: dto.location }),
      ...(dto.accuracy !== undefined && { accuracy: dto.accuracy }),
    },
  });
}
}
