import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccesToken } from 'src/common/config/jwt';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { HousePaymentController } from './purchased-course.controller';
import { HousePaymentService } from './purchased-course.service';

@Module({
  imports:[JwtModule.register(JwtAccesToken)],
  controllers: [HousePaymentController],
  providers: [HousePaymentService,AuthGuard],
})
export class PurchasedCourseModule {}
