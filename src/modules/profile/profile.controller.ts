import { 
    Controller, Put, UseGuards, UseInterceptors, UploadedFile, Body, Req, 
    Post,
    Get,
    Delete,
    NotFoundException,
    Patch
  } from '@nestjs/common';
  import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { v4 as uuidv4 } from 'uuid';
  import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
  import { PhoneUpdateDto, UpdatePasswordDto, UpdateProfileDto } from './dto/profile.dto';
  import { ProfileService } from './profile.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserType } from '@prisma/client';
  
  @ApiTags('Profile')
  @Controller('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  export class ProfileController {
    constructor(private profileService: ProfileService,private prisma:PrismaService) {}
  
    @Patch('update')
    @UseInterceptors(FileInterceptor('profileImg'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          firstName: { type: 'string', example: 'Ali' },
          lastName: { type: 'string', example: 'Valiyev' },
          role: { type: 'string', enum: ['BUY', 'SELL'], example: 'BUY' },
          profileImg: { type: 'string', format: 'binary' }, // faqat Swagger uchun
        },
      },
    })
    async updateProfile(
      @Req() req,
      @Body() dto: UpdateProfileDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      const userId = req.user.id;
  
      const user = await this.prisma.users.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
  
      let uploadedUrl: string | undefined;
  
      if (file) {
        const form = new FormData();
        form.append('image', file.buffer.toString('base64'));
  
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=7b80af0a58ffc5ed794b3d3955d402c0`,
          form,
          { headers: form.getHeaders() },
        );
  
        uploadedUrl = response.data.data.url;
      }
  
      return this.prisma.users.update({
        where: { id: userId },
        data: {
          ...(dto.firstName && { firstName: dto.firstName }),
          ...(dto.lastName && { lastName: dto.lastName }),
          ...(dto.role && { role: dto.role as UserType }),
          ...(uploadedUrl && { profileImg: uploadedUrl }), // faqat fayl kelsa yoziladi
        },
      });
    }
  
    @Post("phone/update")
    @ApiOperation({ summary: "Telefon raqamni yangilash (OTP tekshiruv bilan)" })
    async updatePhone(@Req() req: Request,@Body() body: PhoneUpdateDto,) {
      let user = req["user"];
      return this.profileService.updatePhone(user.id, body);
    }

    @Put("password/update")
  @ApiOperation({ summary: "Parolni yangilash" })
  @ApiBody({ type: UpdatePasswordDto })
  async updatePassword(@Req() req: Request,@Body() payload: UpdatePasswordDto) {
    let user = req["user"];
    return this.profileService.updatePassword(user.id, payload);
  } 


  
  @Get("my/profile")
  @ApiOperation({ summary: "Foydalanuvchi profilini olish (self)" })
  async getProfile(@Req() req: Request) {
    let user = req["user"];
    return this.profileService.myProfile(user.id);
  }

  @Delete("delete/profile")
  @ApiOperation({ summary: "Foydalanuvchi profilini olish (self)" })
  async deleteProfile(@Req() req: Request) {
    let user = req["user"];
    return this.profileService.deleteProfile(user.id);
  }


  }
  