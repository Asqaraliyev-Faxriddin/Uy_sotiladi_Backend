import { Module } from '@nestjs/common';
import { HouseService } from './house.service';
import { HouseController } from './house.controller';
import { JwtAccesToken } from 'src/common/config/jwt';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule.register(JwtAccesToken)],
  controllers: [HouseController],
  providers: [HouseService],
})
export class HouseModule {}
