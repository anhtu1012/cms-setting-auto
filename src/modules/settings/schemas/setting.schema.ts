import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema({ timestamps: true })
export class Setting {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true, type: Object })
  value: any;

  @Prop()
  description?: string;

  @Prop({
    default: 'general',
    enum: ['general', 'appearance', 'security', 'notification', 'integration'],
  })
  category: string;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ default: false })
  isSystem: boolean;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
