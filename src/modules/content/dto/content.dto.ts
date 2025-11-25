import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContentDto {
  @ApiProperty({
    example: 'Getting Started with NestJS',
    description: 'Content title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'getting-started-with-nestjs',
    description: 'Content URL slug',
  })
  @IsString()
  slug: string;

  @ApiProperty({
    example: {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Hello World' }] },
      ],
    },
    description: 'Content body (rich text or any format)',
  })
  body: any;

  @ApiPropertyOptional({
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    description: 'Content status',
  })
  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Author user ID',
  })
  @IsString()
  author: string;

  @ApiPropertyOptional({
    example: ['nestjs', 'typescript', 'tutorial'],
    description: 'Content tags',
  })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({
    example: 'Learn how to get started with NestJS framework',
    description: 'Content excerpt/summary',
  })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/featured.jpg',
    description: 'Featured image URL',
  })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiPropertyOptional({
    example: { seo_title: 'Custom SEO Title', keywords: ['nest', 'js'] },
    description: 'Additional metadata',
  })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateContentDto {
  @ApiPropertyOptional({
    example: 'Getting Started with NestJS',
    description: 'Content title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'getting-started-with-nestjs',
    description: 'Content URL slug',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Hello World' }] },
      ],
    },
    description: 'Content body (rich text or any format)',
  })
  @IsOptional()
  body?: any;

  @ApiPropertyOptional({
    enum: ['draft', 'published', 'archived'],
    description: 'Content status',
  })
  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: string;

  @ApiPropertyOptional({
    example: ['nestjs', 'typescript', 'tutorial'],
    description: 'Content tags',
  })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({
    example: 'Learn how to get started with NestJS framework',
    description: 'Content excerpt/summary',
  })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/featured.jpg',
    description: 'Featured image URL',
  })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiPropertyOptional({
    example: { seo_title: 'Custom SEO Title', keywords: ['nest', 'js'] },
    description: 'Additional metadata',
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
