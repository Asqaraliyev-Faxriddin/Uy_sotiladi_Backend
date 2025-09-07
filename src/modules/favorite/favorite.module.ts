import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccesToken } from 'src/common/config/jwt';

@Module({
  imports:[JwtModule.register(JwtAccesToken)],
  providers: [FavoriteService],
  controllers: [FavoriteController]
})
export class FavoriteModule {}
