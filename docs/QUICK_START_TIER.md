# 🚀 Quick Start - Tier System

## Bước 1: Chạy Migration

```bash
# Khởi động MongoDB (nếu chưa chạy)
# mongod hoặc docker-compose up -d

# Chạy migration để thêm tier fields cho users hiện có
npx ts-node src/migrations/add-tier-to-users.ts
```

Output mong đợi:

```
✅ Connected to MongoDB
📊 Found 5 users without tier field
✅ Updated 5 users with tier fields
📝 Sample updated users:
  - user1@example.com: tier=free
  - user2@example.com: tier=free
✅ Migration completed successfully!
```

## Bước 2: Khởi động Server

```bash
npm run start:dev
```

## Bước 3: Test APIs

### 3.1 Đăng nhập để lấy token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "yourpassword"
  }'
```

Lưu `accessToken` từ response.

### 3.2 Kiểm tra tier info

```bash
curl http://localhost:3000/tier/info \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:

```json
{
  "tier": "free",
  "limits": {
    "maxDatabases": 2,
    "maxDataPerCollection": 100,
    "maxCollectionsPerDatabase": 5,
    "maxStorageGB": 1,
    "maxApiCallsPerDay": 1000
  },
  "usage": {
    "databases": 0,
    "apiCallsToday": 0
  }
}
```

### 3.3 Tạo database (với limit check)

```bash
curl -X POST http://localhost:3000/databases \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-first-db",
    "displayName": "My First Database"
  }'
```

✅ Success nếu chưa đạt limit (< 2 databases)
❌ Error 403 nếu đã đạt limit (>= 2 databases)

### 3.4 Tạo data (với limit check)

```bash
curl -X POST http://localhost:3000/{databaseId}/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product 1",
    "price": 100
  }'
```

✅ Success nếu chưa đạt limit (< 100 data)
❌ Error 403 nếu đã đạt limit (>= 100 data)

## Bước 4: Test Limit Enforcement

### Test Database Limit

```bash
# Tạo database 1
curl -X POST http://localhost:3000/databases \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "db1", "displayName": "Database 1"}'

# Tạo database 2
curl -X POST http://localhost:3000/databases \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "db2", "displayName": "Database 2"}'

# Tạo database 3 - SẼ BỊ CHẶN
curl -X POST http://localhost:3000/databases \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "db3", "displayName": "Database 3"}'
```

Response lỗi:

```json
{
  "statusCode": 403,
  "message": "You have reached the maximum number of databases (2) for your free tier. Please upgrade your account or delete unused databases."
}
```

### Test Data Limit

```bash
# Script tạo 100 data items
for i in {1..100}; do
  curl -X POST http://localhost:3000/{databaseId}/products \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Product $i\", \"price\": $i}"
done

# Item thứ 101 - SẼ BỊ CHẶN
curl -X POST http://localhost:3000/{databaseId}/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Product 101", "price": 101}'
```

## Bước 5: Nâng cấp Tier (Admin)

```bash
curl -X POST http://localhost:3000/tier/upgrade \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_TO_UPGRADE",
    "newTier": "premium",
    "reason": "Payment successful"
  }'
```

## Bước 6: Kiểm tra Usage Statistics

```bash
# Kiểm tra usage theo collection
curl http://localhost:3000/tier/data-usage/{databaseId} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:

```json
[
  {
    "collection": "products",
    "count": 85,
    "limit": 100,
    "percentage": 85.0
  },
  {
    "collection": "categories",
    "count": 15,
    "limit": 100,
    "percentage": 15.0
  }
]
```

## 📊 Swagger UI

Mở browser và truy cập:

```
http://localhost:3000/api
```

Tìm section **"Tier Management"** để test tất cả endpoints.

## 🎯 Test Scenarios

### Scenario 1: FREE User Journey

1. ✅ Tạo database 1 → Success
2. ✅ Tạo database 2 → Success
3. ❌ Tạo database 3 → Blocked (limit reached)
4. ✅ Xóa database 1 → Success
5. ✅ Tạo database 3 → Success (vì đã xóa 1)

### Scenario 2: Data Limit Test

1. ✅ Tạo 99 data items → Success
2. ✅ Tạo item 100 → Success
3. ❌ Tạo item 101 → Blocked (limit reached)
4. ✅ Xóa 1 item → Success
5. ✅ Tạo item mới → Success (vì đã xóa 1)

### Scenario 3: Upgrade Journey

1. User FREE (2 databases max)
2. Admin upgrade to PREMIUM
3. User có thể tạo đến 20 databases
4. User có thể tạo đến 10,000 data/collection

## 🐛 Troubleshooting

### Lỗi: "User not found"

- Chạy migration script
- Hoặc tạo user mới

### Lỗi: "Database not found or access denied"

- Kiểm tra databaseId có đúng không
- Kiểm tra database có thuộc về user không

### Lỗi: 401 Unauthorized

- Token hết hạn, đăng nhập lại
- Token không đúng format

## 📝 Notes

- **FREE tier**: Mặc định cho tất cả users mới
- **Limit check**: Tự động, không cần code thêm
- **Ownership**: Guard tự động verify
- **Performance**: Sử dụng `countDocuments()` tối ưu

## 🎓 Học thêm

Đọc chi tiết tại:

- `TIER_SYSTEM_GUIDE.md` - Full documentation
- `TIER_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `src/common/enums/tier.enum.ts` - Tier configurations

## ✅ Checklist

- [ ] Chạy migration
- [ ] Server khởi động thành công
- [ ] Test login và lấy token
- [ ] Test tier info API
- [ ] Test database limit
- [ ] Test data limit
- [ ] Test upgrade tier
- [ ] Đọc full documentation

Happy coding! 🚀
