import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CollectionSchemaModel,
  CollectionSchemaSchema,
} from './schemas/collection-schema.schema';
import { DynamicData, DynamicDataSchema } from './schemas/dynamic-data.schema';
import { Database, DatabaseSchema } from './schemas/database.schema';
import { CollectionSchemaService } from './controller/collection-schema/collection-schema.service';
import { CollectionSchemaController } from './controller/collection-schema/collection-schema.controller';
import { DynamicDataService } from './controller/dynamic-data/dynamic-data.service';
import { DynamicDataController } from './controller/dynamic-data/dynamic-data.controller';
import { RelationshipService } from './controller/dynamic-data/relationship.service';
import { DatabaseService } from './controller/database/database.service';
import { DatabaseController } from './controller/database/database.controller';
import { DatabaseOwnershipGuard } from '../../common/guards/database-ownership.guard';
import { TierLimitsGuard } from '../../common/guards/tier-limits.guard';
import { User, UserSchema } from '../users/schemas/user.schema';
import { TierModule } from '../../common/tier/tier.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Database.name, schema: DatabaseSchema },
      { name: CollectionSchemaModel.name, schema: CollectionSchemaSchema },
      { name: DynamicData.name, schema: DynamicDataSchema },
      { name: User.name, schema: UserSchema },
    ]),
    TierModule, // Import TierModule để sử dụng TierConfigService trong TierLimitsGuard
  ],
  controllers: [
    DatabaseController,
    CollectionSchemaController,
    DynamicDataController,
  ],
  providers: [
    DatabaseService,
    CollectionSchemaService,
    DynamicDataService,
    RelationshipService,
    DatabaseOwnershipGuard,
    TierLimitsGuard,
  ],
  exports: [
    DatabaseService,
    CollectionSchemaService,
    DynamicDataService,
    RelationshipService,
    MongooseModule, // Export để guards có thể inject models
  ],
})
export class DynamicCmsModule {}
