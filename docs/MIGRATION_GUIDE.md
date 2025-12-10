# Migration Commands - Hướng dẫn sử dụng

## Các lệnh Migration có sẵn

### 1. Seed Tier Configuration (Bắt buộc chạy đầu tiên)

Seed default tier configurations vào database (free, basic, premium, enterprise):

```bash
npm run migration:tier
```

Hoặc sử dụng lệnh tổng quát:

```bash
npm run migration:run seed-tier-config
```

**Output mong đợi:**

```
✅ Tier configuration seeded successfully!

Default tiers created:
- free: 2 databases, 100 data/collection
- basic: 5 databases, 1000 data/collection
- premium: 20 databases, 10000 data/collection
- enterprise: unlimited
```

### 2. Add Tier to Existing Users

Nếu database đã có users từ trước, chạy migration này để thêm tier field:

```bash
npm run migration:run add-tier-to-users
```

**Output mong đợi:**

```
📊 Found 10 users without tier
🔄 Setting default tier to "free"...
  ✓ Updated user: user1@example.com (1/10)
  ✓ Updated user: user2@example.com (2/10)
  ...
✅ Successfully updated 10 users!

📊 Current tier distribution:
  - free: 10 users
```

## Workflow Migration đầy đủ

### Lần đầu setup

```bash
# 1. Build project
npm run build

# 2. Seed tier configs
npm run migration:tier

# 3. Nếu có users hiện có, thêm tier cho họ
npm run migration:run add-tier-to-users

# 4. Start server
npm run start:dev
```

### Chạy lại migration

Nếu cần chạy lại (ví dụ reset tier configs):

```bash
# Xóa tier configs cũ qua MongoDB shell hoặc Compass
# Sau đó chạy lại:
npm run migration:tier
```

## Tạo Migration mới

### Cách 1: Tạo file migration thủ công

1. Tạo file trong `src/migrations/`:

```typescript
// src/migrations/my-migration.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

async function myMigration() {
  console.log('🚀 Starting my migration...');

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Your migration logic here

    console.log('✅ Migration completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await app.close();
  }
}

myMigration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

2. Chạy migration:

```bash
npm run migration:run my-migration
```

### Cách 2: Thêm shortcut vào package.json

Thêm vào `scripts` section:

```json
{
  "scripts": {
    "migration:my": "npm run migration:run my-migration"
  }
}
```

Sau đó chạy:

```bash
npm run migration:my
```

## Các lệnh khác

### Check migration có sẵn

```bash
node scripts/run-migration.js
```

Output:

```
❌ Error: Migration name is required

Usage:
  npm run migration:run <migration-name>

Available migrations:
  - seed-tier-config       : Seed default tier configurations
  - add-tier-to-users      : Add tier field to existing users
```

### Build trước khi chạy migration

Nếu đã sửa code migration:

```bash
npm run build
npm run migration:run seed-tier-config
```

### Debug migration

Thêm console.log hoặc chạy với Node debugger:

```bash
npm run build
node --inspect-brk dist/migrations/seed-tier-config.js
```

## Troubleshooting

### Migration fails với "Cannot find module"

**Nguyên nhân:** Chưa build project

**Giải pháp:**

```bash
npm run build
npm run migration:run <migration-name>
```

### Migration fails với "Connection timeout"

**Nguyên nhân:** MongoDB chưa start hoặc connection string sai

**Giải pháp:**

1. Check MongoDB đang chạy
2. Verify `.env` có `MONGODB_URI` đúng
3. Test connection: `mongosh <connection-string>`

### Migration chạy nhưng không có data

**Nguyên nhân:** Có thể đã seed rồi

**Giải pháp:**

```bash
# Check trong MongoDB
mongosh
use your_database_name
db.tierconfigs.find().pretty()

# Nếu cần xóa và seed lại
db.tierconfigs.deleteMany({})
exit

# Chạy lại migration
npm run migration:tier
```

### Users vẫn không có tier sau migration

**Nguyên nhân:** Chưa chạy migration add-tier-to-users

**Giải pháp:**

```bash
npm run migration:run add-tier-to-users
```

## Best Practices

1. **Luôn backup database trước khi chạy migration**

   ```bash
   mongodump --uri="mongodb://..." --out=./backup
   ```

2. **Test migration trên local trước**
   - Chạy trên local/dev environment
   - Verify kết quả
   - Mới deploy lên staging/production

3. **Version control migrations**
   - Commit migration files vào git
   - Đặt tên có ý nghĩa: `YYYY-MM-DD-description.ts`

4. **Idempotent migrations**
   - Migration nên safe để chạy nhiều lần
   - Check điều kiện trước khi update
   - Ví dụ: `seed-tier-config` không tạo duplicate

5. **Log đầy đủ**
   - Console.log progress
   - Show thống kê trước/sau
   - Error messages rõ ràng

## Production Deployment

### Checklist

- [ ] Test migration trên local
- [ ] Backup production database
- [ ] Chạy migration trên staging
- [ ] Verify kết quả
- [ ] Deploy lên production
- [ ] Chạy migration production
- [ ] Verify production data

### Commands

```bash
# 1. Backup production
mongodump --uri="<production-uri>" --out=./backup-prod-$(date +%Y%m%d)

# 2. Build & upload
npm run build
# Upload dist/ folder lên server

# 3. SSH vào server
ssh user@server

# 4. Chạy migration
cd /path/to/app
npm run migration:tier

# 5. Verify
npm run migration:run add-tier-to-users

# 6. Start app
pm2 restart cms-api
```

## Rollback

Nếu migration fails và cần rollback:

```bash
# 1. Stop app
pm2 stop cms-api

# 2. Restore backup
mongorestore --uri="<connection-uri>" --drop ./backup-prod-20241210/

# 3. Verify
mongosh
use your_database
db.tierconfigs.countDocuments()
db.users.countDocuments()

# 4. Start app với code cũ
git checkout <previous-commit>
npm run build
pm2 restart cms-api
```

## FAQ

**Q: Migration có chạy tự động khi deploy không?**
A: Không, phải chạy manual để control được timing.

**Q: Có thể rollback migration không?**
A: Có, restore từ backup hoặc tạo migration ngược lại.

**Q: Migration có lock database không?**
A: Tùy vào operation. Insert/Update thường không block.

**Q: Chạy migration bao lâu?**
A: Tùy data size:

- seed-tier-config: < 1 giây
- add-tier-to-users: ~0.1s/1000 users

**Q: Có thể chạy migration concurrent không?**
A: Không nên, có thể gây race condition.

---

**Last Updated:** December 2024
**Version:** 1.0
