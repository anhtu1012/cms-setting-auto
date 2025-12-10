import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import {
  CreateCollectionSchemaDto,
  UpdateCollectionSchemaDto,
} from '../../dto/collection-schema.dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { DatabaseOwnershipGuard } from '../../../../common/guards/database-ownership.guard';
import { DatabaseId } from '../../../../common/decorators/database-id.decorator';
import { CollectionSchemaService } from './collection-schema.service';
import { COLLECTION_SCHEMA_ROUTES } from '../../../../common/constants/api-routes.constants';

@ApiTags('collection-schemas')
@Controller(COLLECTION_SCHEMA_ROUTES.BASE)
@UseGuards(JwtAuthGuard, DatabaseOwnershipGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'x-database-id',
  description: 'Database ID that user has access to',
  required: true,
  schema: { type: 'string', example: '507f1f77bcf86cd799439011' },
})
export class CollectionSchemaController {
  constructor(
    private readonly collectionSchemaService: CollectionSchemaService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new collection schema (table)' })
  @ApiResponse({
    status: 201,
    description: 'Collection schema created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or duplicate name' })
  create(
    @Body() createDto: CreateCollectionSchemaDto,
    @DatabaseId() databaseId: string,
    @Request() req,
  ) {
    // Override databaseId from header instead of body
    const dto = { ...createDto, databaseId };
    return this.collectionSchemaService.create(dto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all collection schemas with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Collection schemas retrieved' })
  findAll(
    @Query() paginationDto: PaginationDto,
    @DatabaseId() databaseId: string,
    @Request() req,
  ) {
    return this.collectionSchemaService.findAll(
      paginationDto,
      req.user.userId,
      databaseId,
    );
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all collection schemas (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Schemas retrieved (paginated)' })
  findAllSchemas(
    @Query() paginationDto: PaginationDto,
    @DatabaseId() databaseId: string,
    @Request() req,
  ) {
    return this.collectionSchemaService.findAll(
      paginationDto,
      req.user.userId,
      databaseId,
    );
  }

  @Get('by-name/:name')
  @ApiOperation({ summary: 'Get collection schema by name' })
  @ApiParam({
    name: 'name',
    example: 'products',
    description: 'Collection name',
  })
  @ApiResponse({ status: 200, description: 'Schema found' })
  @ApiResponse({ status: 404, description: 'Schema not found' })
  async findByName(
    @Param('name') name: string,
    @DatabaseId() databaseId: string,
    @Request() req,
  ) {
    const schema = await this.collectionSchemaService.findByName(
      name,
      req.user.userId,
      databaseId,
    );

    if (!schema) {
      throw new NotFoundException(
        `Collection schema with name "${name}" not found`,
      );
    }

    return schema;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get collection schema by ID' })
  @ApiResponse({ status: 200, description: 'Schema found' })
  @ApiResponse({ status: 404, description: 'Schema not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.collectionSchemaService.findById(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update collection schema' })
  @ApiResponse({ status: 200, description: 'Schema updated successfully' })
  @ApiResponse({ status: 404, description: 'Schema not found' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCollectionSchemaDto,
    @Request() req,
  ) {
    return this.collectionSchemaService.update(id, updateDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete collection schema' })
  @ApiResponse({ status: 200, description: 'Schema deleted successfully' })
  @ApiResponse({ status: 404, description: 'Schema not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.collectionSchemaService.remove(id, req.user.userId);
  }

  @Post('validate/:collectionName')
  @ApiOperation({ summary: 'Validate data against schema' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiBody({
    description: 'Data to validate against the collection schema',
    schema: {
      type: 'object',
      example: {
        product_name: 'iPhone 15 Pro',
        sku: 'IPHONE-15-PRO',
        price: 999.99,
        category: 'electronics',
        in_stock: true,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Validation result returned',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        errors: {
          type: 'array',
          items: { type: 'string' },
          example: [],
        },
      },
    },
  })
  validateData(
    @Param('collectionName') collectionName: string,
    @DatabaseId() databaseId: string,
    @Body() data: Record<string, any>,
    @Request() req,
  ) {
    return this.collectionSchemaService.validateData(
      collectionName,
      req.user.userId,
      databaseId,
      data,
    );
  }
}
