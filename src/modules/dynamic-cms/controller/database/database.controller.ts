import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DatabaseService } from './database.service';
import {
  CreateDatabaseDto,
  UpdateDatabaseDto,
  DatabaseResponseDto,
  DatabaseListResponseDto,
} from '../../dto/database.dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Databases')
@Controller('databases')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new database' })
  @ApiResponse({
    status: 201,
    description: 'Database created successfully',
    type: DatabaseResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Database name already exists' })
  async create(
    @Body() createDatabaseDto: CreateDatabaseDto,
    @Request() req,
  ): Promise<DatabaseResponseDto> {
    return this.databaseService.create(createDatabaseDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all databases of current user' })
  @ApiResponse({
    status: 200,
    description: 'List of databases',
    type: DatabaseListResponseDto,
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Request() req,
  ): Promise<DatabaseListResponseDto> {
    return this.databaseService.findAllByUser(req.user.userId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get database by ID' })
  @ApiResponse({
    status: 200,
    description: 'Database details',
    type: DatabaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Database not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<DatabaseResponseDto> {
    return this.databaseService.findOne(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update database' })
  @ApiResponse({
    status: 200,
    description: 'Database updated successfully',
    type: DatabaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Database not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async update(
    @Param('id') id: string,
    @Body() updateDatabaseDto: UpdateDatabaseDto,
    @Request() req,
  ): Promise<DatabaseResponseDto> {
    return this.databaseService.update(id, updateDatabaseDto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate database (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Database deactivated successfully',
  })
  @ApiResponse({ status: 404, description: 'Database not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async remove(
    @Param('id') id: string,
    @Request() req,
  ): Promise<{ message: string }> {
    return this.databaseService.remove(id, req.user.userId);
  }

  @Delete(':id/permanent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Permanently delete database' })
  @ApiResponse({
    status: 200,
    description: 'Database permanently deleted',
  })
  @ApiResponse({ status: 404, description: 'Database not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async permanentDelete(
    @Param('id') id: string,
    @Request() req,
  ): Promise<{ message: string }> {
    return this.databaseService.permanentDelete(id, req.user.userId);
  }
}
