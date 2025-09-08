import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    Put,
    Delete,
    ParseIntPipe,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { ContactService } from './contact.service';
  import { CreateContactDto } from './dto/create.contact.dtp';
  import { UpdateContactDto } from './dto/create.contact.dtp';
  import { QueryContactDto } from './dto/create.contact.dtp';
  import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
    ApiBody,
  } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
  
  @ApiTags('Contacts')
  @ApiBearerAuth() 
  @Controller('contacts')
  @UseGuards(AuthGuard,RolesGuard)
  export class ContactController {
    constructor(private readonly contactService: ContactService) {}
  
    @Post("create")
    @ApiOperation({ summary: 'Create new contact' })
    @ApiBody({type:CreateContactDto})
    @ApiResponse({ status: 201, description: 'Contact successfully created' })
    create(@Body() dto: CreateContactDto,@Req() req) {
      return this.contactService.create(dto,req.user.id);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all contacts (with pagination & email filter)' })
    @ApiResponse({ status: 200, description: 'List of contacts returned' })
    findAll(@Query() query: QueryContactDto) {
      return this.contactService.findAll(query);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get single contact by ID' })
    @ApiResponse({ status: 200, description: 'Contact found' })
    @ApiResponse({ status: 404, description: 'Contact not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.contactService.findOne(BigInt(id));
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update contact (only owner or admin)' })
    @ApiResponse({ status: 200, description: 'Contact updated successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Contact not found' })
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateContactDto,
      @Req() req: any, 
    ) {
      return this.contactService.update(BigInt(id), dto, req.user.id);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete contact (only owner or admin)' })
    @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Contact not found' })
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
      return this.contactService.remove(BigInt(id), req.user.id);
    }
  }
  