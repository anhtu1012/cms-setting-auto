import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { CollectionSchemaService } from '../src/modules/dynamic-cms/collection-schema.service';
import { CreateCollectionSchemaDto } from '../src/modules/dynamic-cms/dto/collection-schema.dto';
import * as schemas from './collection-schemas.json';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const schemaService = app.get(CollectionSchemaService);

  console.log('🌱 Seeding collection schemas...\n');

  for (const schema of schemas.collection_schemas) {
    try {
      // Check if exists
      const existing = await schemaService.findByName(schema.name);

      if (existing) {
        console.log(`⏭️  Schema "${schema.name}" already exists, skipping...`);
        continue;
      }

      // Create schema with proper typing
      await schemaService.create(schema as CreateCollectionSchemaDto);
      console.log(`✅ Created schema: ${schema.displayName} (${schema.name})`);
    } catch (error) {
      console.error(
        `❌ Error creating schema "${schema.name}":`,
        error.message,
      );
    }
  }

  console.log('\n✨ Seeding completed!');
  await app.close();
}

bootstrap();
