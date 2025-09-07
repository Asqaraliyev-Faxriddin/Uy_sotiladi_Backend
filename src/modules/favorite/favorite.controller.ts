import { 
    Body, 
    Controller, 
    Delete, 
    Param, 
    ParseBoolPipe, 
    ParseIntPipe, 
    Patch, 
    Post 
  } from '@nestjs/common';
  import { FavoriteService } from './favorite.service';
  import { CreateFavoriteDto } from './dto/create-favorite.dto';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  
  @ApiTags('Favorites')
  @Controller('favorites')
  export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}
  
    @Post()
    @ApiOperation({ summary: 'Yangi favorit yaratish' })
    @ApiResponse({ status: 201, description: 'Favorite muvaffaqiyatli yaratildi' })
    @ApiResponse({ status: 404, description: 'User yoki House topilmadi' })
    create(@Body() dto: CreateFavoriteDto) {
      return this.favoriteService.create(dto);
    }
  
    @Patch('One/:id/like/:like')
    @ApiOperation({ summary: 'Faqat like qiymatini yangilash' })
    @ApiResponse({ status: 200, description: 'Like yangilandi' })
    @ApiResponse({ status: 404, description: 'Favorite topilmadi' })
    updateLike(
      @Param('id', ParseIntPipe) id: number,
      @Param('like', ParseBoolPipe) like: boolean,
    ) {
      return this.favoriteService.updateLike(BigInt(id), like);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Favorite ni o‘chirish' })
    @ApiResponse({ status: 200, description: 'Favorite o‘chirildi' })
    @ApiResponse({ status: 404, description: 'Favorite topilmadi' })
    delete(@Param('id', ParseIntPipe) id: number) {
      return this.favoriteService.delete(BigInt(id));
    }
  }
  