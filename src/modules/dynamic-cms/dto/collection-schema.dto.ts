import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsEnum,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FieldType, RelationType } from '../interfaces/field-types.interface';

export class FieldValidationDto {
  @ApiPropertyOptional({ description: 'Field is required' })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({ description: 'Minimum value for number fields' })
  @IsOptional()
  @IsNumber()
  min?: number;

  @ApiPropertyOptional({ description: 'Maximum value for number fields' })
  @IsOptional()
  @IsNumber()
  max?: number;

  @ApiPropertyOptional({ description: 'Minimum length for text fields' })
  @IsOptional()
  @IsNumber()
  minLength?: number;

  @ApiPropertyOptional({ description: 'Maximum length for text fields' })
  @IsOptional()
  @IsNumber()
  maxLength?: number;

  @ApiPropertyOptional({ description: 'Regex pattern for validation' })
  @IsOptional()
  @IsString()
  pattern?: string;

  @ApiPropertyOptional({ description: 'Allowed enum values', type: [String] })
  @IsOptional()
  @IsArray()
  enum?: string[];
}

export class SelectOptionDto {
  @ApiProperty({ description: 'Option label', example: 'Option 1' })
  @IsString()
  label: string;

  @ApiProperty({ description: 'Option value', example: 'option1' })
  @IsString()
  value: string;
}

export class ReferenceConfigDto {
  @ApiProperty({ description: 'Referenced collection name', example: 'users' })
  @IsString()
  collection: string;

  @ApiProperty({
    description: 'Display field from referenced collection',
    example: 'name',
  })
  @IsString()
  displayField: string;

  @ApiPropertyOptional({
    description: 'Allow multiple references',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  multiple?: boolean;

  @ApiPropertyOptional({
    enum: RelationType,
    description: 'Type of relationship',
    example: RelationType.ONE_TO_MANY,
  })
  @IsOptional()
  @IsEnum(RelationType)
  relationType?: RelationType;

  @ApiPropertyOptional({
    description: 'Cascade delete when parent is deleted',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  cascadeDelete?: boolean;

  @ApiPropertyOptional({
    description:
      'Field name in the referenced collection for bidirectional relationship',
    example: 'userId',
  })
  @IsOptional()
  @IsString()
  inverseSide?: string;

  @ApiPropertyOptional({
    description: 'Automatically populate this reference when querying',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  autoPopulate?: boolean;

  @ApiPropertyOptional({
    description: 'Fields to populate from referenced collection',
    type: [String],
    example: ['name', 'email'],
  })
  @IsOptional()
  @IsArray()
  populateFields?: string[];

  @ApiPropertyOptional({
    description: 'Maximum depth for nested population',
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  populateDepth?: number;
}

export class FieldDefinitionDto {
  @ApiProperty({ description: 'Field name (slug)', example: 'product_name' })
  @IsString()
  name: string;

  @ApiProperty({ enum: FieldType, description: 'Field type' })
  @IsEnum(FieldType)
  type: FieldType;

  @ApiProperty({ description: 'Field display label', example: 'Product Name' })
  @IsOptional()
  @IsString()
  label: string;

  @ApiPropertyOptional({ description: 'Field description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Default value for the field' })
  @IsOptional()
  defaultValue?: any;

  @ApiPropertyOptional({
    description: 'Validation rules',
    type: FieldValidationDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FieldValidationDto)
  validation?: FieldValidationDto;

  @ApiPropertyOptional({
    description: 'Options for select/radio fields',
    type: [SelectOptionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectOptionDto)
  options?: SelectOptionDto[];

  @ApiPropertyOptional({
    description: 'Reference configuration',
    type: ReferenceConfigDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ReferenceConfigDto)
  referenceConfig?: ReferenceConfigDto;

  @ApiPropertyOptional({ description: 'Placeholder text' })
  @IsOptional()
  @IsString()
  placeholder?: string;

  @ApiPropertyOptional({ description: 'Help text' })
  @IsOptional()
  @IsString()
  helpText?: string;

  @ApiPropertyOptional({ description: 'Show in list view', default: true })
  @IsOptional()
  @IsBoolean()
  showInList?: boolean;

  @ApiPropertyOptional({ description: 'Show in form', default: true })
  @IsOptional()
  @IsBoolean()
  showInForm?: boolean;

  @ApiPropertyOptional({ description: 'Field is sortable', default: false })
  @IsOptional()
  @IsBoolean()
  sortable?: boolean;

  @ApiPropertyOptional({ description: 'Field is searchable', default: false })
  @IsOptional()
  @IsBoolean()
  searchable?: boolean;

  @ApiPropertyOptional({ description: 'Display order', default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class CreateCollectionSchemaDto {
  @ApiProperty({
    description: 'Database ID that this collection belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  databaseId: string;

  @ApiProperty({
    description: 'Collection name (slug)',
    example: 'products',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Collection display name',
    example: 'Products',
  })
  @IsString()
  displayName: string;

  @ApiPropertyOptional({
    description: 'Collection description',
    example: 'Manage product catalog',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Icon name', example: 'shopping-cart' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: 'Field definitions',
    type: [FieldDefinitionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDefinitionDto)
  fields: FieldDefinitionDto[];

  @ApiPropertyOptional({
    description: 'Auto-add timestamps',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  timestamps?: boolean;

  @ApiPropertyOptional({
    description: 'Enable soft delete',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  softDelete?: boolean;

  @ApiPropertyOptional({
    description: 'Enable auto-generated API',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  enableApi?: boolean;

  @ApiPropertyOptional({
    description: 'Custom API path',
    example: '/api/v1/products',
  })
  @IsOptional()
  @IsString()
  apiPath?: string;

  @ApiPropertyOptional({
    description: 'Permission configuration',
    example: { create: ['admin'], read: ['admin', 'user'] },
  })
  @IsOptional()
  permissions?: {
    create?: string[];
    read?: string[];
    update?: string[];
    delete?: string[];
  };
}

export class UpdateCollectionSchemaDto {
  @ApiPropertyOptional({ description: 'Collection display name' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ description: 'Collection description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Icon name' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Field definitions',
    type: [FieldDefinitionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDefinitionDto)
  fields?: FieldDefinitionDto[];

  @ApiPropertyOptional({ description: 'Auto-add timestamps' })
  @IsOptional()
  @IsBoolean()
  timestamps?: boolean;

  @ApiPropertyOptional({ description: 'Enable soft delete' })
  @IsOptional()
  @IsBoolean()
  softDelete?: boolean;

  @ApiPropertyOptional({ description: 'Enable auto-generated API' })
  @IsOptional()
  @IsBoolean()
  enableApi?: boolean;

  @ApiPropertyOptional({ description: 'Custom API path' })
  @IsOptional()
  @IsString()
  apiPath?: string;

  @ApiPropertyOptional({ description: 'Permission configuration' })
  @IsOptional()
  permissions?: {
    create?: string[];
    read?: string[];
    update?: string[];
    delete?: string[];
  };
}
