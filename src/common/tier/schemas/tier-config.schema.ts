import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TierConfigDocument = TierConfig & Document;

/**
 * Schema cho cấu hình Tier
 * Lưu trữ các tier và giới hạn tương ứng trong database
 */
@Schema({ timestamps: true })
export class TierConfig {
  @Prop({ required: true, unique: true, index: true })
  tierCode: string; // free, basic, premium, enterprise

  @Prop({ required: true })
  tierName: string; // Free, Basic, Premium, Enterprise

  @Prop()
  description?: string;

  @Prop({ required: true })
  maxDatabases: number; // -1 = unlimited

  @Prop({ required: true })
  maxDataPerCollection: number; // -1 = unlimited

  @Prop({ required: true })
  maxCollectionsPerDatabase: number; // -1 = unlimited

  @Prop({ required: true })
  maxStorageGB: number; // -1 = unlimited

  @Prop({ required: true })
  maxApiCallsPerDay: number; // -1 = unlimited

  @Prop({ default: 0 })
  price: number; // Giá của tier (nếu có)

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ default: true })
  isActive: boolean; // Có thể tắt tier

  @Prop({ default: 0 })
  displayOrder: number; // Thứ tự hiển thị

  @Prop({ type: Object })
  metadata?: Record<string, any>; // Thông tin bổ sung tùy chỉnh
}

export const TierConfigSchema = SchemaFactory.createForClass(TierConfig);

// Index để tìm kiếm nhanh
TierConfigSchema.index({ isActive: 1, displayOrder: 1 });
