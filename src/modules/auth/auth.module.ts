import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccesToken } from 'src/common/config/jwt';
import { VerificationService } from '../verification/verification.service';
import { SmsService } from 'src/common/services/sms.service';
import { RedisService } from 'src/core/prisma/redis/redis.service';
import { AppMailerService } from 'src/common/mailer/mailer.service';
import { RedisModule } from 'src/core/prisma/redis/redis.module';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Global()
@Module({
  imports:[
    JwtModule.register(JwtAccesToken)
  ],
  controllers: [AuthController],
  providers: [AuthService,VerificationService,SmsService,RedisService,AppMailerService,RedisModule,PrismaModule]
})
export class AuthModule {}
