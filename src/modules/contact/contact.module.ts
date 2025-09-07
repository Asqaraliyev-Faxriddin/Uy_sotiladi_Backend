import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { JwtAccesToken } from 'src/common/config/jwt';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule.register(JwtAccesToken)],
  providers: [ContactService],
  controllers: [ContactController]
})
export class ContactModule {}
