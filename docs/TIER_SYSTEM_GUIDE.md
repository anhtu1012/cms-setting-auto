# Hệ Thống Cấp Bậc Tài Khoản (Account Tier System)

## Tổng Quan

Hệ thống cấp bậc tài khoản cho phép quản lý giới hạn tài nguyên dựa trên tier (cấp độ) của người dùng. Mỗi tier có các giới hạn khác nhau về:

- Số lượng database có thể tạo
- Số lượng data có thể tạo trong mỗi collection
- Số lượng collection trong mỗi database
- Dung lượng lưu trữ
- Số lượng API calls mỗi ngày

## Các Cấp Bậc (Tiers)

### 1. FREE (Miễn phí)

```typescript
{
  maxDatabases: 2,
  maxDataPerCollection: 100,
  maxCollectionsPerDatabase: 5,
  maxStorageGB: 1,
  maxApiCallsPerDay: 1000,
}
```

### 2. BASIC (Cơ bản)

```typescript
{
  maxDatabases: 5,
  maxDataPerCollection: 1000,
  maxCollectionsPerDatabase: 20,
  maxStorageGB: 5,
  maxApiCallsPerDay: 10000,
}
```

### 3. PREMIUM (Cao cấp)

```typescript
{
  maxDatabases: 20,
  maxDataPerCollection: 10000,
  maxCollectionsPerDatabase: 100,
  maxStorageGB: 50,
  maxApiCallsPerDay: 100000,
}
```

### 4. ENTERPRISE (Doanh nghiệp)

```typescript
{
  maxDatabases: -1, // Không giới hạn
  maxDataPerCollection: -1, // Không giới hạn
  maxCollectionsPerDatabase: -1, // Không giới hạn
  maxStorageGB: -1, // Không giới hạn
  maxApiCallsPerDay: -1, // Không giới hạn
}
```

## Cấu Trúc Files

```
src/
├── common/
│   ├── enums/
│   │   └── tier.enum.ts              # Định nghĩa enum và giới hạn tier
│   ├── guards/
│   │   └── tier-limits.guard.ts      # Guard kiểm tra giới hạn
│   └── tier/
│       ├── tier.module.ts            # Module quản lý tier
│       ├── tier.service.ts           # Service xử lý logic tier
│       └── tier.controller.ts        # Controller API endpoints
└── modules/
    └── users/
        └── schemas/
            └── user.schema.ts        # Schema User với trường tier
```

## User Schema Updates

Đã thêm các trường sau vào User schema:

```typescript
// Thông tin tier
tier: AccountTier;                    // Cấp bậc hiện tại
tierStartDate?: Date;                 // Ngày bắt đầu tier
tierExpiryDate?: Date;                // Ngày hết hạn tier
tierHistory: Array<{                  // Lịch sử thay đổi tier
  tier: AccountTier;
  startDate: Date;
  endDate?: Date;
  upgradeReason?: string;
}>;

// Thống kê sử dụng
currentDatabaseCount: number;         // Số database hiện tại
lastApiCallReset?: Date;              // Lần reset API call cuối
apiCallsToday: number;                // Số API calls hôm nay
```

## API Endpoints

### 1. Lấy thông tin tier hiện tại

```http
GET /tier/info
Authorization: Bearer <token>
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
    "databases": 1,
    "apiCallsToday": 45
  }
}
```

### 2. Kiểm tra giới hạn database

```http
GET /tier/check-database-limit
Authorization: Bearer <token>
```

Response:

```json
{
  "allowed": true,
  "current": 1,
  "limit": 2
}
```

### 3. Kiểm tra giới hạn data

```http
GET /tier/check-data-limit/:databaseId/:collectionName
Authorization: Bearer <token>
```

Response:

```json
{
  "allowed": false,
  "reason": "Maximum data per collection reached (100) for free tier",
  "current": 100,
  "limit": 100
}
```

### 4. Lấy thống kê sử dụng data

```http
GET /tier/data-usage/:databaseId
Authorization: Bearer <token>
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

### 5. Nâng cấp tier (Admin only)

```http
POST /tier/upgrade
Authorization: Bearer <token>
```

Body:

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "newTier": "premium",
  "reason": "Thanh toán gói premium"
}
```

## Cách Hoạt Động

### 1. Kiểm tra giới hạn khi tạo database

Khi user gọi `POST /databases`, `TierLimitsGuard` sẽ:

1. Lấy thông tin tier của user
2. Đếm số database hiện tại
3. So sánh với giới hạn
4. Cho phép hoặc từ chối request

```typescript
// Trong database.controller.ts
@Post()
@UseGuards(TierLimitsGuard)  // ✅ Guard tự động kiểm tra
async create(@Body() createDatabaseDto: CreateDatabaseDto) {
  // Logic tạo database
}
```

### 2. Kiểm tra giới hạn khi tạo data

Khi user gọi `POST /:databaseId/:collectionName`, `TierLimitsGuard` sẽ:

1. Lấy thông tin tier của user
2. Kiểm tra databaseId có thuộc về user không
3. Đếm số data hiện tại trong collection
4. So sánh với giới hạn
5. Cho phép hoặc từ chối request

```typescript
// Trong dynamic-data.controller.ts
@Post()
@UseGuards(TierLimitsGuard)  // ✅ Guard tự động kiểm tra
async create(
  @Param('databaseId') databaseId: string,
  @Param('collectionName') collectionName: string,
  @Body() data: Record<string, any>,
) {
  // Logic tạo data
}
```

### 3. Quy trình kiểm tra trong Guard

```typescript
// TierLimitsGuard tự động:
1. Lấy userId từ request.user
2. Tìm user và lấy tier
3. Lấy giới hạn theo tier
4. Kiểm tra endpoint (tạo database hay tạo data)
5. Đếm số lượng hiện tại
6. So sánh và quyết định cho phép/từ chối
```

## Response Errors

### Khi vượt quá giới hạn database:

```json
{
  "statusCode": 403,
  "message": "You have reached the maximum number of databases (2) for your free tier. Please upgrade your account or delete unused databases."
}
```

### Khi vượt quá giới hạn data:

```json
{
  "statusCode": 403,
  "message": "You have reached the maximum number of data (100) per collection for your free tier. Please upgrade your account or delete unused data."
}
```

## Ví dụ Sử Dụng

### Tạo database (có kiểm tra giới hạn)

```bash
# User có tier FREE (giới hạn 2 databases)
curl -X POST http://localhost:3000/databases \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-new-database",
    "displayName": "My New Database"
  }'

# Nếu đã có 2 databases:
# → Error: 403 Forbidden - Reached maximum databases
```

### Tạo data (có kiểm tra giới hạn)

```bash
# User có tier FREE (giới hạn 100 data/collection)
curl -X POST http://localhost:3000/database-id/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "price": 999
  }'

# Nếu collection đã có 100 data:
# → Error: 403 Forbidden - Reached maximum data per collection
```

### Kiểm tra giới hạn trước khi tạo

```bash
# Kiểm tra có thể tạo database không
curl http://localhost:3000/tier/check-database-limit \
  -H "Authorization: Bearer <token>"

# Response: { "allowed": true, "current": 1, "limit": 2 }
```

## Tích hợp vào Frontend

```typescript
// Kiểm tra trước khi cho phép user tạo database
async checkCanCreateDatabase() {
  const response = await fetch('/tier/check-database-limit', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const result = await response.json();

  if (!result.allowed) {
    // Hiển thị thông báo nâng cấp tier
    showUpgradeModal(result.reason);
    return false;
  }
  return true;
}

// Hiển thị progress bar
async showDataUsage(databaseId: string) {
  const response = await fetch(`/tier/data-usage/${databaseId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const collections = await response.json();

  collections.forEach(col => {
    console.log(`${col.collection}: ${col.count}/${col.limit} (${col.percentage}%)`);
    // Render progress bar
  });
}
```

## Nâng cấp Tier

Admin có thể nâng cấp tier cho user:

```typescript
// Trong backend
await tierService.upgradeTier(
  userId,
  AccountTier.PREMIUM,
  'Thanh toán qua Stripe',
);
```

Hoặc qua API:

```bash
curl -X POST http://localhost:3000/tier/upgrade \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011",
    "newTier": "premium",
    "reason": "Thanh toán thành công"
  }'
```

## Migration Dữ Liệu

Đối với user hiện tại trong database, cần chạy migration để set tier mặc định:

```typescript
// Migration script
await User.updateMany(
  { tier: { $exists: false } },
  {
    $set: {
      tier: AccountTier.FREE,
      tierStartDate: new Date(),
      currentDatabaseCount: 0,
      apiCallsToday: 0,
      tierHistory: [],
    },
  },
);
```

## Best Practices

1. **Kiểm tra giới hạn ở Guard level**: Tự động, không cần check trong service
2. **Hiển thị thông tin tier rõ ràng**: User cần biết giới hạn của họ
3. **Thông báo trước khi đạt giới hạn**: Warning khi usage > 80%
4. **Dễ dàng nâng cấp**: Cung cấp flow nâng cấp mượt mà
5. **Tracking usage**: Lưu lại lịch sử sử dụng cho analytics

## Testing

```typescript
// Test tier limits
describe('TierLimitsGuard', () => {
  it('should block database creation when limit reached', async () => {
    // Setup user with 2 databases (FREE tier limit)
    // Attempt to create 3rd database
    // Expect 403 error
  });

  it('should block data creation when limit reached', async () => {
    // Setup collection with 100 data (FREE tier limit)
    // Attempt to create 101st data
    // Expect 403 error
  });

  it('should allow unlimited for ENTERPRISE tier', async () => {
    // Setup user with ENTERPRISE tier
    // Should allow any number of databases/data
  });
});
```

## Lưu Ý Quan Trọng

1. **Giá trị -1 = Unlimited**: Dành cho tier ENTERPRISE
2. **Guard tự động kiểm tra**: Không cần code thêm trong service
3. **DatabaseId validation**: Guard tự động kiểm tra ownership
4. **Performance**: Đếm document bằng `countDocuments()` - tối ưu
5. **Security**: Luôn verify user ownership trước khi check limits

## Roadmap

- [ ] Thêm soft limit warning (80% usage)
- [ ] Email notification khi đạt giới hạn
- [ ] Analytics dashboard cho admin
- [ ] Auto-upgrade qua payment gateway
- [ ] Quota reset theo cycle (monthly/yearly)
- [ ] API rate limiting theo tier

## Liên Hệ & Hỗ Trợ

Nếu có câu hỏi về hệ thống tier, vui lòng liên hệ team development.
