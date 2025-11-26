import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { CollectionSchemaService } from '../src/modules/dynamic-cms/controller/collection-schema/collection-schema.service';
import { DatabaseService } from '../src/modules/dynamic-cms/controller/database/database.service';
import { UsersService } from '../src/modules/users/users.service';
import { CreateCollectionSchemaDto } from '../src/modules/dynamic-cms/dto/collection-schema.dto';
import * as schemas from './collection-schemas.json';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const schemaService = app.get(CollectionSchemaService);
  const databaseService = app.get(DatabaseService);
  const usersService = app.get(UsersService);

  console.log('🌱 Seeding collection schemas...\n');

  // Create or get a demo user for seeding
  const demoEmail = 'demo@example.com';
  let demoUser = await usersService.findByEmail(demoEmail);

  if (!demoUser) {
    demoUser = await usersService.create({
      email: demoEmail,
      userName: 'demo_user',
      password: 'Demo@123456',
      firstName: 'Demo',
      lastName: 'User',
      role: 'admin',
    });
    console.log('✅ Demo user created');
  }

  // Get user ID safely
  const userId = (demoUser as any)._id?.toString() || (demoUser as any).id;

  // Create or get a demo database
  const demoDatabases = await databaseService.findAllByUser(userId, {
    page: 1,
    limit: 10,
  });
  let demoDatabase = demoDatabases.data.find(
    (db) => db.name === 'demo-database',
  );

  if (!demoDatabase) {
    demoDatabase = await databaseService.create(
      {
        name: 'demo-database',
        displayName: 'Demo Database',
        description: 'Demo database for seeding',
        icon: '🌱',
      },
      userId,
    );
    console.log('✅ Demo database created\n');
  }

  for (const schema of schemas.collection_schemas) {
    try {
      // Check if schema already exists in this database
      const allSchemas = await schemaService.findAll(
        { page: 1, limit: 1000 },
        userId,
        demoDatabase.databaseId,
      );

      const existing = allSchemas.data.find((s) => s.name === schema.name);

      if (existing) {
        console.log(`⏭️  Schema "${schema.name}" already exists, skipping...`);
        continue;
      }

      // Create schema with proper typing and ownership
      await schemaService.create(
        {
          ...schema,
          databaseId: demoDatabase.databaseId,
        } as CreateCollectionSchemaDto,
        userId,
      );
      console.log(`✅ Created schema: ${schema.displayName} (${schema.name})`);
    } catch (error) {
      console.error(
        `❌ Error creating schema "${schema.name}":`,
        error.message,
      );
    }
  }

  console.log('\n✨ Seeding completed!');
  console.log(`📝 Demo User ID: ${userId}`);
  console.log(`📝 Demo Database ID: ${demoDatabase.databaseId}`);
  await app.close();
}

bootstrap();
