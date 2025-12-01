"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const collection_schema_service_1 = require("../src/modules/dynamic-cms/controller/collection-schema/collection-schema.service");
const database_service_1 = require("../src/modules/dynamic-cms/controller/database/database.service");
const users_service_1 = require("../src/modules/users/users.service");
const schemas = require("./collection-schemas.json");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const schemaService = app.get(collection_schema_service_1.CollectionSchemaService);
    const databaseService = app.get(database_service_1.DatabaseService);
    const usersService = app.get(users_service_1.UsersService);
    console.log('🌱 Seeding collection schemas...\n');
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
    const userId = demoUser._id?.toString() || demoUser.id;
    const demoDatabases = await databaseService.findAllByUser(userId, {
        page: 1,
        limit: 10,
    });
    let demoDatabase = demoDatabases.data.find((db) => db.name === 'demo-database');
    if (!demoDatabase) {
        demoDatabase = await databaseService.create({
            name: 'demo-database',
            displayName: 'Demo Database',
            description: 'Demo database for seeding',
            icon: '🌱',
        }, userId);
        console.log('✅ Demo database created\n');
    }
    for (const schema of schemas.collection_schemas) {
        try {
            const allSchemas = await schemaService.findAll({ page: 1, limit: 1000 }, userId, demoDatabase.databaseId);
            const existing = allSchemas.data.find((s) => s.name === schema.name);
            if (existing) {
                console.log(`⏭️  Schema "${schema.name}" already exists, skipping...`);
                continue;
            }
            await schemaService.create({
                ...schema,
                databaseId: demoDatabase.databaseId,
            }, userId);
            console.log(`✅ Created schema: ${schema.displayName} (${schema.name})`);
        }
        catch (error) {
            console.error(`❌ Error creating schema "${schema.name}":`, error.message);
        }
    }
    console.log('\n✨ Seeding completed!');
    console.log(`📝 Demo User ID: ${userId}`);
    console.log(`📝 Demo Database ID: ${demoDatabase.databaseId}`);
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed-schemas.js.map