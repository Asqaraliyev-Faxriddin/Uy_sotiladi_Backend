import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from './common/mailer/mailer.module';
import { VerificationModule } from './modules/verification/verification.module';
import { RedisModule } from './core/prisma/redis/redis.module';
import { ProfileModule } from './modules/profile/profile.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { RatingModule } from './modules/rating/rating.module';
import { PurchasedCourseModule } from './modules/purchased-course/purchased-course.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule, AuthModule,MailerModule,AuthModule,VerificationModule,
    RedisModule,     ProfileModule,JwtModule,RatingModule,PurchasedCourseModule],
})
export class AppModule {}
