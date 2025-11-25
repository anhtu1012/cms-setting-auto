import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ContentDocument = Content & Document;

@Schema({ timestamps: true })
export class Content {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true, type: Object })
  body: any;

  @Prop({ default: 'draft', enum: ['draft', 'published', 'archived'] })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  excerpt?: string;

  @Prop()
  featuredImage?: string;

  @Prop()
  publishedAt?: Date;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
