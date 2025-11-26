import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DynamicDataDocument = DynamicData & Document;

/**
 * Schema lưu trữ dữ liệu động của user
 * Mọi data của các collection động sẽ được lưu vào đây
 * Mỗi record thuộc về 1 user, 1 database và 1 collection
 */
@Schema({ timestamps: true, collection: 'dynamic_data' })
export class DynamicData {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId; // User sở hữu data này

  @Prop({ type: Types.ObjectId, ref: 'Database', required: true, index: true })
  databaseId: Types.ObjectId; // Database chứa data này

  @Prop({ required: true, index: true })
  _collection: string; // Tên collection này thuộc về

  @Prop({ type: Object, required: true })
  _data: Record<string, any>; // Dữ liệu thực tế (flexible schema)

  @Prop({ default: null })
  deletedAt?: Date | null; // Cho soft delete

  @Prop()
  createdBy?: string;

  @Prop()
  updatedBy?: string;
}

export const DynamicDataSchema = SchemaFactory.createForClass(DynamicData);

// Indexes để query nhanh
DynamicDataSchema.index({ userId: 1, databaseId: 1, _collection: 1 });
DynamicDataSchema.index({ userId: 1, _collection: 1, deletedAt: 1 });
DynamicDataSchema.index({ databaseId: 1, _collection: 1, deletedAt: 1 });
DynamicDataSchema.index({ _collection: 1, createdAt: -1 });
DynamicDataSchema.index({ createdBy: 1 });
DynamicDataSchema.index({ userId: 1, createdAt: -1 });

// Virtual để access data dễ hơn
DynamicDataSchema.virtual('data').get(function () {
  return this._data;
});
