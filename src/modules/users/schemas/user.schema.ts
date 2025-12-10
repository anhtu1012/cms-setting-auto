import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ default: 'user', enum: ['admin', 'user', 'editor'] })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  avatar?: string;

  @Prop()
  lastLogin?: Date;

  // Account Tier Information - Sử dụng tierCode động thay vì enum
  @Prop({
    type: String,
    default: 'free', // Default tier code
    index: true,
  })
  tier: string; // tierCode: 'free', 'basic', 'premium', 'enterprise', hoặc tùy chỉnh

  @Prop()
  tierStartDate?: Date;

  @Prop()
  tierExpiryDate?: Date;

  @Prop({
    type: [
      {
        tier: String,
        startDate: Date,
        endDate: Date,
        upgradeReason: String,
      },
    ],
    default: [],
  })
  tierHistory: Array<{
    tier: string; // tierCode
    startDate: Date;
    endDate?: Date;
    upgradeReason?: string;
  }>;

  // Usage Statistics (để tracking giới hạn)
  @Prop({ default: 0 })
  currentDatabaseCount: number;

  @Prop()
  lastApiCallReset?: Date;

  @Prop({ default: 0 })
  apiCallsToday: number;

  // Wallet and Points Information
  @Prop({ default: 0 })
  points: number;

  @Prop({ default: 0 })
  walletBalance: number;

  @Prop({
    type: [{ date: Date, amount: Number, type: String, description: String }],
    default: [],
  })
  walletTransactions: Array<{
    date: Date;
    amount: number;
    type: string; // 'credit' or 'debit'
    description: string;
  }>;

  @Prop({ type: [{ date: Date, points: Number, reason: String }], default: [] })
  pointsHistory: Array<{
    date: Date;
    points: number;
    reason: string;
  }>;
}

export const UserSchema = SchemaFactory.createForClass(User);
