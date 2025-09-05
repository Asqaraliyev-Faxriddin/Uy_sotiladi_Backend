import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccesToken } from 'src/common/config/jwt';

@Module({
  imports:[JwtModule.register(JwtAccesToken)],
  providers: [ProfileService],
  controllers: [ProfileController]
})
export class ProfileModule {}
