import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CollectionSchemaModel,
  CollectionSchemaSchema,
} from './schemas/collection-schema.schema';
import { DynamicData, DynamicDataSchema } from './schemas/dynamic-data.schema';
import { CollectionSchemaService } from './collection-schema.service';
import { CollectionSchemaController } from './collection-schema.controller';
import { DynamicDataService } from './dynamic-data.service';
import { DynamicDataController } from './dynamic-data.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CollectionSchemaModel.name, schema: CollectionSchemaSchema },
      { name: DynamicData.name, schema: DynamicDataSchema },
    ]),
  ],
  controllers: [CollectionSchemaController, DynamicDataController],
  providers: [CollectionSchemaService, DynamicDataService],
  exports: [CollectionSchemaService, DynamicDataService],
})
export class DynamicCmsModule {}
