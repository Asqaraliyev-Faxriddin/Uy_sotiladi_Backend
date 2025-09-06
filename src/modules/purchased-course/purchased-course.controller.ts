import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { HousePaymentService } from "./purchased-course.service"; 
import { HousePaymentDto } from "./dto/create-purchased-course.dto";
import { Cron } from "@nestjs/schedule";
import { AuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/Roles.decorator";
import { UserType } from "@prisma/client";

@ApiTags("House Payment")
@Controller("house-payment")
export class HousePaymentController {
  constructor(private readonly housePaymentService: HousePaymentService) {}

  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard,RolesGuard)
  @Post()
  @ApiOperation({ summary: "Uy uchun to'lov qilish" })
  @ApiResponse({ status: 201, description: "To'lov muvaffaqiyatli yaratildi" })
  async createPayment(@Body() payload: HousePaymentDto) {
    return this.housePaymentService.createPayment(payload);
  }

  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard,RolesGuard)
  @Get("user/:email")
  @ApiOperation({ summary: "Foydalanuvchi email orqali to'lovlarini olish" })
  async getPaymentsByEmail(@Param("email") email: string) {
    return this.housePaymentService.getPaymentsByEmail(email);
  }

  @Cron("0 0 * * *") 
  async handlePaymentCheck() {
    console.log("Har 24 soatda eski tolovlar tekshirilmoqda...");
    await this.housePaymentService.removeExpiredPayments();
  }

  @Roles(UserType.ADMIN)
  @UseGuards(AuthGuard,RolesGuard)
  @Delete("user/:email")
  @ApiOperation({ summary: "Foydalanuvchining barcha to'lovlarini o'chirish (faqat admin)" })
  @ApiParam({ name: "email", description: "Foydalanuvchi email manzili", type: String })
  async deleteUserPayments(@Param("email") email: string) {
    return this.housePaymentService.DeletePurchase(email);
  }
}
