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
import { FavoriteModule } from './modules/favorite/favorite.module';
import { HouseModule } from './modules/house/house.module';
import { CategoryModule } from './modules/category/category.module';
import { ContactModule } from './modules/contact/contact.module';
import { SeaderModule } from './core/prisma/seader/seader.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule, AuthModule,MailerModule,AuthModule,VerificationModule,
    RedisModule,  SeaderModule,   ProfileModule,JwtModule,RatingModule,PurchasedCourseModule, FavoriteModule, HouseModule, CategoryModule, ContactModule],
})
export class AppModule {}
  