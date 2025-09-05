import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { SmsService } from 'src/common/services/sms.service';
import { RedisModule } from 'src/core/prisma/redis/redis.module';

@Module({
  controllers: [VerificationController],
  providers: [VerificationService,SmsService,RedisModule],
  exports:[VerificationService]
})
export class VerificationModule {}
