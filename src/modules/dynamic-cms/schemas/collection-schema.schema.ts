import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FieldDefinition } from '../interfaces/field-types.interface';

export type CollectionSchemaDocument = CollectionSchemaModel & Document;

/**
 * Schema lưu trữ cấu trúc của các collection động
 * Đây là "meta-schema" - schema định nghĩa các schema khác
 */
@Schema({ timestamps: true, collection: 'collection_schemas' })
export class CollectionSchemaModel {
  @Prop({ required: true, unique: true, index: true })
  name: string; // Tên collection (slug): "products", "posts"

  @Prop({ required: true })
  displayName: string; // Tên hiển thị: "Sản phẩm", "Bài viết"

  @Prop()
  description?: string;

  @Prop()
  icon?: string;

  @Prop({ type: Array, required: true })
  fields: FieldDefinition[]; // Danh sách các field

  @Prop({ default: true })
  timestamps: boolean;

  @Prop({ default: false })
  softDelete: boolean;

  @Prop({ default: true })
  enableApi: boolean;

  @Prop()
  apiPath?: string;

  @Prop({ type: Object })
  permissions?: {
    create?: string[];
    read?: string[];
    update?: string[];
    delete?: string[];
  };

  @Prop()
  createdBy?: string;

  @Prop({ default: 1 })
  version: number;
}

export const CollectionSchemaSchema = SchemaFactory.createForClass(
  CollectionSchemaModel,
);

// Index cho search và performance
CollectionSchemaSchema.index({ createdBy: 1 });
