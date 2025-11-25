import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DynamicDataDocument = DynamicData & Document;

/**
 * Schema lưu trữ dữ liệu động của user
 * Mọi data của các collection động sẽ được lưu vào đây
 */
@Schema({ timestamps: true, collection: 'dynamic_data' })
export class DynamicData {
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
DynamicDataSchema.index({ _collection: 1, deletedAt: 1 });
DynamicDataSchema.index({ _collection: 1, createdAt: -1 });
DynamicDataSchema.index({ createdBy: 1 });

// Virtual để access data dễ hơn
DynamicDataSchema.virtual('data').get(function () {
  return this._data;
});
