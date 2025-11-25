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
import { DynamicDataService } from './dynamic-data.service';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('dynamic-data')
@Controller('dynamic-data/:collectionName')
export class DynamicDataController {
  constructor(private readonly dynamicDataService: DynamicDataService) {}

  @Post()
  @ApiOperation({ summary: 'Create new document in dynamic collection' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiBody({
    description: 'Document data to create',
    schema: {
      type: 'object',
      example: {
        product_name: 'iPhone 15 Pro',
        sku: 'IPHONE-15-PRO',
        price: 999.99,
        category: 'electronics',
        description: 'Latest iPhone model',
        tags: ['new', 'bestseller'],
        in_stock: true,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Collection schema not found' })
  create(
    @Param('collectionName') collectionName: string,
    @Body() data: Record<string, any>,
  ) {
    return this.dynamicDataService.create(collectionName, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents from dynamic collection' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Documents retrieved' })
  findAll(
    @Param('collectionName') collectionName: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.dynamicDataService.findAll(collectionName, paginationDto);
  }

  @Post('query')
  @ApiOperation({ summary: 'Query documents with custom filter' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiBody({
    description: 'Query filter with optional sort, limit, skip',
    schema: {
      type: 'object',
      properties: {
        filter: {
          type: 'object',
          example: { category: 'electronics', in_stock: true },
        },
        sort: {
          type: 'object',
          example: { price: -1, createdAt: -1 },
        },
        limit: { type: 'number', example: 20 },
        skip: { type: 'number', example: 0 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Query results returned' })
  query(
    @Param('collectionName') collectionName: string,
    @Body()
    body: {
      filter: Record<string, any>;
      sort?: Record<string, 1 | -1>;
      limit?: number;
      skip?: number;
    },
  ) {
    return this.dynamicDataService.query(collectionName, body.filter, {
      sort: body.sort,
      limit: body.limit,
      skip: body.skip,
    });
  }

  @Get('count')
  @ApiOperation({ summary: 'Count documents in collection' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiResponse({ status: 200, description: 'Count returned' })
  count(@Param('collectionName') collectionName: string) {
    return this.dynamicDataService.count(collectionName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Document found' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  findOne(
    @Param('collectionName') collectionName: string,
    @Param('id') id: string,
  ) {
    return this.dynamicDataService.findById(collectionName, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update document by ID' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  @ApiBody({
    description: 'Fields to update (partial update supported)',
    schema: {
      type: 'object',
      example: {
        price: 899.99,
        in_stock: false,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Document updated' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  update(
    @Param('collectionName') collectionName: string,
    @Param('id') id: string,
    @Body() data: Record<string, any>,
  ) {
    return this.dynamicDataService.update(collectionName, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete document by ID' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Document deleted' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  softDelete(
    @Param('collectionName') collectionName: string,
    @Param('id') id: string,
  ) {
    return this.dynamicDataService.softDelete(collectionName, id);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Permanently delete document by ID' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Document permanently deleted' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  hardDelete(
    @Param('collectionName') collectionName: string,
    @Param('id') id: string,
  ) {
    return this.dynamicDataService.hardDelete(collectionName, id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore soft-deleted document' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Document restored' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  restore(
    @Param('collectionName') collectionName: string,
    @Param('id') id: string,
  ) {
    return this.dynamicDataService.restore(collectionName, id);
  }
}
