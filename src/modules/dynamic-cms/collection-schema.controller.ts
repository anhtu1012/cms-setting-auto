import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CollectionSchemaService } from './collection-schema.service';
import {
  CreateCollectionSchemaDto,
  UpdateCollectionSchemaDto,
} from './dto/collection-schema.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('collection-schemas')
@Controller('collection-schemas')
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
  create(@Body() createDto: CreateCollectionSchemaDto) {
    return this.collectionSchemaService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all collection schemas with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Collection schemas retrieved' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.collectionSchemaService.findAll(paginationDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all collection schemas (no pagination)' })
  @ApiResponse({ status: 200, description: 'All schemas retrieved' })
  findAllSchemas() {
    return this.collectionSchemaService.findAllSchemas();
  }

  @Get('by-name/:name')
  @ApiOperation({ summary: 'Get collection schema by name' })
  @ApiParam({ name: 'name', example: 'products' })
  @ApiResponse({ status: 200, description: 'Schema found' })
  @ApiResponse({ status: 404, description: 'Schema not found' })
  findByName(@Param('name') name: string) {
    return this.collectionSchemaService.findByName(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get collection schema by ID' })
  @ApiResponse({ status: 200, description: 'Schema found' })
  @ApiResponse({ status: 404, description: 'Schema not found' })
  findOne(@Param('id') id: string) {
    return this.collectionSchemaService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update collection schema' })
  @ApiResponse({ status: 200, description: 'Schema updated successfully' })
  @ApiResponse({ status: 404, description: 'Schema not found' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCollectionSchemaDto,
  ) {
    return this.collectionSchemaService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete collection schema' })
  @ApiResponse({ status: 200, description: 'Schema deleted successfully' })
  @ApiResponse({ status: 404, description: 'Schema not found' })
  remove(@Param('id') id: string) {
    return this.collectionSchemaService.remove(id);
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
    @Body() data: Record<string, any>,
  ) {
    return this.collectionSchemaService.validateData(collectionName, data);
  }
}
