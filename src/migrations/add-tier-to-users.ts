import { MongoClient } from 'mongodb';

/**
 * Migration script để thêm tier fields cho các user hiện có
 * Run: npx ts-node src/migrations/add-tier-to-users.ts
 */

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/cms-setting-auto';

async function migrateTierFields() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    // Đếm users không có tier field
    const usersWithoutTier = await usersCollection.countDocuments({
      tier: { $exists: false },
    });

    console.log(`📊 Found ${usersWithoutTier} users without tier field`);

    if (usersWithoutTier === 0) {
      console.log('✅ All users already have tier field. Nothing to migrate.');
      return;
    }

    // Update users without tier field
    const result = await usersCollection.updateMany(
      { tier: { $exists: false } },
      {
        $set: {
          tier: 'free', // Default tier
          tierStartDate: new Date(),
          currentDatabaseCount: 0,
          apiCallsToday: 0,
          tierHistory: [],
        },
      },
    );

    console.log(`✅ Updated ${result.modifiedCount} users with tier fields`);

    // Verify results
    const updatedUsers = await usersCollection
      .find({ tier: 'free' })
      .limit(3)
      .toArray();

    console.log('\n📝 Sample updated users:');
    updatedUsers.forEach((user) => {
      console.log(`  - ${user.email}: tier=${user.tier}`);
    });

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration
migrateTierFields()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error:', error);
    process.exit(1);
  });
