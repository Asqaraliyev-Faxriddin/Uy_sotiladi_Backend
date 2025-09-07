import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccesToken } from 'src/common/config/jwt';

@Module({
  imports:[JwtModule.register(JwtAccesToken)],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
