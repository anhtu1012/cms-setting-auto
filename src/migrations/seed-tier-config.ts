import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TierConfigService } from '../common/tier/tier-config.service';

/**
 * Migration script để seed tier configuration vào database
 *
 * Chạy bằng lệnh:
 * npm run build && node dist/migrations/seed-tier-config.js
 */
async function seedTierConfig() {
  console.log('🚀 Starting tier configuration seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const tierConfigService = app.get(TierConfigService);

  try {
    // Seed default tiers
    await tierConfigService.seedDefaultTiers();

    console.log('✅ Tier configuration seeded successfully!');
    console.log('\nDefault tiers created:');
    console.log('- free: 2 databases, 100 data/collection');
    console.log('- basic: 5 databases, 1000 data/collection');
    console.log('- premium: 20 databases, 10000 data/collection');
    console.log('- enterprise: unlimited');

    // Hiển thị tất cả tiers
    const tiers = await tierConfigService.getAllTiers(true);
    console.log('\nAll tiers in database:');
    tiers.forEach((tier) => {
      console.log(
        `  - ${tier.tierCode} (${tier.tierName}): ${tier.isActive ? 'Active' : 'Inactive'}`,
      );
    });
  } catch (error) {
    console.error('❌ Error seeding tier configuration:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run migration
seedTierConfig()
  .then(() => {
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
