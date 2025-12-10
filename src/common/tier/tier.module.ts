import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TierService } from './tier.service';
import { User, UserSchema } from '../../modules/users/schemas/user.schema';
import {
  Database,
  DatabaseSchema,
} from '../../modules/dynamic-cms/schemas/database.schema';
import {
  DynamicData,
  DynamicDataSchema,
} from '../../modules/dynamic-cms/schemas/dynamic-data.schema';
import { TierController } from './tier.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Database.name, schema: DatabaseSchema },
      { name: DynamicData.name, schema: DynamicDataSchema },
    ]),
  ],
  controllers: [TierController],
  providers: [TierService],
  exports: [TierService],
})
export class TierModule {}
