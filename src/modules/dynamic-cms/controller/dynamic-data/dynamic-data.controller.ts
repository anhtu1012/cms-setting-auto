import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { DynamicDataService } from './dynamic-data.service';

@ApiTags('dynamic-data')
@Controller(':databaseId/:collectionName')
export class DynamicDataController {
  constructor(private readonly dynamicDataService: DynamicDataService) {}

  @Post()
  @ApiOperation({ summary: 'Create new document in dynamic collection' })
  @ApiParam({ name: 'databaseId', example: '507f1f77bcf86cd799439011' })
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
    @Param('databaseId') databaseId: string,
    @Param('collectionName') collectionName: string,
    @Body() data: Record<string, any>,
    @Request() req,
  ) {
    const userId = req?.user?.userId || null;
    return this.dynamicDataService.create(
      collectionName,
      databaseId,
      data,
      userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents from dynamic collection' })
  @ApiParam({ name: 'databaseId', example: '507f1f77bcf86cd799439011' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Documents retrieved' })
  findAll(
    @Param('databaseId') databaseId: string,
    @Param('collectionName') collectionName: string,
    @Query() paginationDto: PaginationDto,
    @Request() req,
  ) {
    const userId = req?.user?.userId || null;
    return this.dynamicDataService.findAll(
      collectionName,
      userId,
      databaseId,
      paginationDto,
    );
  }

  @Post('query')
  @ApiOperation({ summary: 'Query documents with custom filter' })
  @ApiParam({ name: 'databaseId', example: '507f1f77bcf86cd799439011' })
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
    @Param('databaseId') databaseId: string,
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
  @ApiParam({ name: 'databaseId', example: '507f1f77bcf86cd799439011' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiResponse({ status: 200, description: 'Count returned' })
  count(
    @Param('databaseId') databaseId: string,
    @Param('collectionName') collectionName: string,
  ) {
    return this.dynamicDataService.count(collectionName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiParam({ name: 'databaseId', example: '507f1f77bcf86cd799439011' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Document found' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  findOne(
    @Param('databaseId') databaseId: string,
    @Param('collectionName') collectionName: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    const userId = req?.user?.userId || null;
    return this.dynamicDataService.findById(
      collectionName,
      id,
      userId,
      databaseId,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update document by ID' })
  @ApiParam({ name: 'databaseId', example: '507f1f77bcf86cd799439011' })
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
    @Param('databaseId') databaseId: string,
    @Param('collectionName') collectionName: string,
    @Param('id') id: string,
    @Body() data: Record<string, any>,
    @Request() req,
  ) {
    const userId = req?.user?.userId || null;
    return this.dynamicDataService.update(
      collectionName,
      id,
      databaseId,
      data,
      userId,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Replace document by ID (full replacement)' })
  @ApiParam({ name: 'databaseId', example: '507f1f77bcf86cd799439011' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  @ApiBody({
    description: 'Complete document data (replaces entire document)',
    schema: {
      type: 'object',
      example: {
        product_name: 'iPhone 15 Pro Max',
        sku: 'IPHONE-15-PRO-MAX',
        price: 1199.99,
        category: 'electronics',
        description: 'Latest iPhone model with larger screen',
        tags: ['new', 'bestseller', 'premium'],
        in_stock: true,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Document replaced' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  replace(
    @Param('databaseId') databaseId: string,
    @Param('collectionName') collectionName: string,
    @Param('id') id: string,
    @Body() data: Record<string, any>,
    @Request() req,
  ) {
    const userId = req?.user?.userId || null;
    return this.dynamicDataService.replace(
      collectionName,
      id,
      databaseId,
      data,
      userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete document by ID' })
  @ApiParam({ name: 'databaseId', example: '507f1f77bcf86cd799439011' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Document deleted' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  softDelete(
    @Param('databaseId') databaseId: string,
    @Param('collectionName') collectionName: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    const userId = req?.user?.userId || null;
    return this.dynamicDataService.softDelete(
      collectionName,
      id,
      userId,
      databaseId,
    );
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Permanently delete document by ID' })
  @ApiParam({ name: 'databaseId', example: '507f1f77bcf86cd799439011' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Document permanently deleted' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  hardDelete(
    @Param('databaseId') databaseId: string,
    @Param('collectionName') collectionName: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    const userId = req?.user?.userId || null;
    return this.dynamicDataService.hardDelete(
      collectionName,
      id,
      userId,
      databaseId,
    );
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore soft-deleted document' })
  @ApiParam({ name: 'databaseId', example: '507f1f77bcf86cd799439011' })
  @ApiParam({ name: 'collectionName', example: 'products' })
  @ApiParam({ name: 'id', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Document restored' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  restore(
    @Param('databaseId') databaseId: string,
    @Param('collectionName') collectionName: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    const userId = req?.user?.userId || null;
    return this.dynamicDataService.restore(
      collectionName,
      id,
      userId,
      databaseId,
    );
  }
}
