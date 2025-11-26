import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FieldDefinition } from '../interfaces/field-types.interface';

export type CollectionSchemaDocument = CollectionSchemaModel & Document;

/**
 * Schema lưu trữ cấu trúc của các collection động
 * Đây là "meta-schema" - schema định nghĩa các schema khác
 * Mỗi collection thuộc về 1 database và 1 user
 */
@Schema({ timestamps: true, collection: 'collection_schemas' })
export class CollectionSchemaModel {
  @Prop({ type: Types.ObjectId, ref: 'Database', required: true, index: true })
  databaseId: Types.ObjectId; // Database chứa collection này

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId; // User sở hữu collection này

  @Prop({ required: true, index: true })
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

  @Prop()
  updatedBy?: string;

  @Prop({ default: 1 })
  version: number;

  @Prop({ default: 0 })
  dataCount?: number; // Số lượng records trong collection này
}

export const CollectionSchemaSchema = SchemaFactory.createForClass(
  CollectionSchemaModel,
);

// Index cho search và performance
CollectionSchemaSchema.index({ userId: 1, databaseId: 1 });
CollectionSchemaSchema.index({ databaseId: 1, name: 1 }, { unique: true }); // Trong 1 DB không có 2 collection cùng tên
CollectionSchemaSchema.index({ userId: 1, name: 1 });
CollectionSchemaSchema.index({ createdBy: 1 });
