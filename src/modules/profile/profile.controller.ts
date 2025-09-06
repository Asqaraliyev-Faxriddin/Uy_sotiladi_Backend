import { 
    Controller, Put, UseGuards, UseInterceptors, UploadedFile, Body, Req, 
    Post,
    Get
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { v4 as uuidv4 } from 'uuid';
  import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
  import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
  import { PhoneUpdateDto, UpdatePasswordDto, UpdateProfileDto } from './dto/profile.dto';
  import { ProfileService } from './profile.service';
  
  @ApiTags('Profile')
  @Controller('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  export class ProfileController {
    constructor(private profileService: ProfileService) {}
  
    @Put('update')
    @UseGuards(AuthGuard)
    @UseInterceptors(
      FileInterceptor('profileImg', {
        storage: diskStorage({
          destination: './uploads/profiles',
          filename: (req, file, callback) => {
            const uniqueName = uuidv4() + extname(file.originalname);
            callback(null, uniqueName);
          },
        }),
      }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'Update profile',
      schema: {
        type: 'object',
        properties: {
          firstName: { type: 'string', example: 'Ali' },
          lastName: { type: 'string', example: 'Valiyev' },
          role: { type: 'string', example: 'BUY', enum: ['BUY', 'SELL'] },
          profileImg: {
            type: 'string',
            format: 'binary', 
          },
        },
      },
    })
    async updateProfile(
      @Req() req,
      @Body() dto: UpdateProfileDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      const userId = req.user.id;
  
      let profileImgPath: string | undefined;
      if (file) {
        profileImgPath = file.filename; 
      }
  
      return this.profileService.updateProfile(userId, dto, profileImgPath);
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


  
  @Get("profile")
  @ApiOperation({ summary: "Foydalanuvchi profilini olish (self)" })
  async getProfile(@Req() req: Request) {
    let user = req["user"];
    return this.profileService.myProfile(user.id);
  }
  }
  