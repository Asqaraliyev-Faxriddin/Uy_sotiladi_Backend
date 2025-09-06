import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  ParseUUIDPipe,
} from "@nestjs/common";
import { RatingService } from "./rating.service";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { Roles } from "src/common/decorators/Roles.decorator";
import { UserType } from "@prisma/client";
import { RolesGuard } from "src/common/guards/roles.guard";
import { AuthGuard } from "src/common/guards/jwt-auth.guard";

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";

@ApiTags("House Ratings")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller("ratings")
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @ApiOperation({ summary: "Uyga baho qo'shish" })
  @ApiResponse({ status: 201, description: "Baho muvaffaqiyatli qo'shildi" })
  async create(@Req() req, @Body() dto: CreateRatingDto) {
    const userId = req.user.id;
    return this.ratingService.create(userId, dto);
  }

  @Roles(UserType.ADMIN)
  @Get("latest")
  @ApiOperation({ summary: "So'nggi 10ta uy reytingi" })
  @ApiResponse({ status: 200, description: "So'nggi 10ta uy reytingi" })
  async findAllLatest() {
    return this.ratingService.findAllLatest();
  }

  @Get("by-house/:houseId")
  @ApiOperation({ summary: "Uyning reytinglarini olish" })
  @ApiResponse({ status: 200, description: "Berilgan uy uchun reytinglar" })
  @ApiQuery({ name: "offset", required: false, example: 0 })
  @ApiQuery({ name: "limit", required: false, example: 10 })
  async findAllBy(
    @Param("houseId", ParseUUIDPipe) houseId: string,
    @Query("offset", ParseIntPipe) offset = 0,
    @Query("limit", ParseIntPipe) limit = 10,
  ) {
    return this.ratingService.findAllBy(houseId, offset, limit);
  }

  @Get("analytics/:houseId")
  @ApiOperation({ summary: "Uyning reyting analitikasi" })
  @ApiResponse({
    status: 200,
    description: "O'rtacha baholar, umumiy reytinglar va taqsimot",
  })
  async getAnalytics(@Param("houseId", ParseUUIDPipe) houseId: string) {
    return this.ratingService.getAnalytics(houseId);
  }

  @Put(":id")
  @ApiOperation({ summary: "Reytingni tahrirlash" })
  @ApiResponse({ status: 200, description: "Reyting yangilandi" })
  async update(
    @Req() req,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Partial<CreateRatingDto>,
  ) {
    return this.ratingService.update(req.user.id, id, dto);
  }

  @Delete(":id")
  @Roles(UserType.ADMIN)
  @ApiOperation({ summary: "Reytingni o'chirish" })
  @ApiResponse({ status: 200, description: "Reyting o'chirildi" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.ratingService.remove(id);
  }
}
