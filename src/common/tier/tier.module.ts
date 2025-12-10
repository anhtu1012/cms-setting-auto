import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TierService } from './tier.service';
import { TierConfigService } from './tier-config.service';
import { TierConfigController } from './tier-config.controller';
import { User, UserSchema } from '../../modules/users/schemas/user.schema';
import {
  Database,
  DatabaseSchema,
} from '../../modules/dynamic-cms/schemas/database.schema';
import {
  DynamicData,
  DynamicDataSchema,
} from '../../modules/dynamic-cms/schemas/dynamic-data.schema';
import { TierConfig, TierConfigSchema } from './schemas/tier-config.schema';
import { TierController } from './tier.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Database.name, schema: DatabaseSchema },
      { name: DynamicData.name, schema: DynamicDataSchema },
      { name: TierConfig.name, schema: TierConfigSchema },
    ]),
  ],
  controllers: [TierController, TierConfigController],
  providers: [TierService, TierConfigService],
  exports: [TierService, TierConfigService],
})
export class TierModule {}
