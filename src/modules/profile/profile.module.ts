import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccesToken } from 'src/common/config/jwt';
import { VerificationModule } from '../verification/verification.module';

@Module({
  imports:[JwtModule.register(JwtAccesToken),VerificationModule],
  providers: [ProfileService],
  controllers: [ProfileController]
})
export class ProfileModule {}
