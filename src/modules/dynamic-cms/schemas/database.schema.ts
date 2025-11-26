import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DatabaseDocument = Database & Document;

/**
 * Schema quản lý các database của user
 * Mỗi user có thể tạo nhiều database
 * Mỗi database chứa nhiều collections
 */
@Schema({ timestamps: true, collection: 'databases' })
export class Database {
  @Prop({ required: true, index: true })
  name: string; // Tên database (slug): "my-ecommerce", "blog-db"

  @Prop({ required: true })
  displayName: string; // Tên hiển thị: "My E-commerce", "Personal Blog"

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId; // User sở hữu database này

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  icon?: string;

  @Prop({ type: Object })
  settings?: {
    defaultLanguage?: string;
    timezone?: string;
    dateFormat?: string;
  };

  @Prop({ type: [String], default: [] })
  tags?: string[]; // Tags để phân loại: "production", "testing", "personal"

  @Prop({ default: 0 })
  collectionsCount?: number; // Số lượng collections trong database

  @Prop({ default: 0 })
  dataCount?: number; // Tổng số records trong database

  @Prop()
  createdBy?: string;

  @Prop()
  updatedBy?: string;
}

export const DatabaseSchema = SchemaFactory.createForClass(Database);

// Indexes
DatabaseSchema.index({ userId: 1, name: 1 }, { unique: true }); // User không được tạo 2 db cùng tên
DatabaseSchema.index({ userId: 1, isActive: 1 });
DatabaseSchema.index({ createdAt: -1 });
