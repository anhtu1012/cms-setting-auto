# API TIER CONFIGURATION - Hướng dẫn sử dụng

## Tổng quan

Hệ thống tier configuration đã được chuyển từ enum cứng sang dynamic configuration qua API. Bây giờ bạn có thể:

- ✅ Tạo tier mới với giới hạn tùy chỉnh
- ✅ Cập nhật giới hạn của tier hiện có
- ✅ Tắt/bật tier
- ✅ Xóa tier không cần thiết
- ✅ Tùy chỉnh giá và metadata

## Cấu trúc Tier

Mỗi tier bao gồm:

```typescript
{
  tierCode: string; // Mã tier (unique): 'free', 'basic', 'premium', etc.
  tierName: string; // Tên hiển thị: 'Free', 'Basic', 'Premium'
  description: string; // Mô tả tier
  maxDatabases: number; // Số database tối đa (-1 = unlimited)
  maxDataPerCollection: number; // Số data tối đa mỗi collection (-1 = unlimited)
  maxCollectionsPerDatabase: number; // Số collection tối đa mỗi database (-1 = unlimited)
  maxStorageGB: number; // Dung lượng lưu trữ GB (-1 = unlimited)
  maxApiCallsPerDay: number; // API calls mỗi ngày (-1 = unlimited)
  price: number; // Giá tier
  currency: string; // Đơn vị tiền tệ
  isActive: boolean; // Có active không
  displayOrder: number; // Thứ tự hiển thị
  metadata: object; // Metadata tùy chỉnh
}
```

## API Endpoints

### 1. Lấy tất cả tiers

```bash
GET /v1/tier-config
GET /v1/tier-config?includeInactive=true  # Bao gồm cả tier inactive
```

**Response:**

```json
[
  {
    "_id": "...",
    "tierCode": "free",
    "tierName": "Free",
    "description": "Gói miễn phí cho người dùng mới",
    "maxDatabases": 2,
    "maxDataPerCollection": 100,
    "maxCollectionsPerDatabase": 5,
    "maxStorageGB": 1,
    "maxApiCallsPerDay": 1000,
    "price": 0,
    "currency": "USD",
    "isActive": true,
    "displayOrder": 0
  }
]
```

### 2. Lấy tier theo code

```bash
GET /v1/tier-config/:tierCode
```

**Ví dụ:**

```bash
GET /v1/tier-config/premium
```

### 3. Lấy limits của tier

```bash
GET /v1/tier-config/:tierCode/limits
```

**Response:**

```json
{
  "maxDatabases": 20,
  "maxDataPerCollection": 10000,
  "maxCollectionsPerDatabase": 100,
  "maxStorageGB": 50,
  "maxApiCallsPerDay": 100000
}
```

### 4. Tạo tier mới (Admin only)

```bash
POST /v1/tier-config
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**

```json
{
  "tierCode": "pro",
  "tierName": "Pro",
  "description": "Gói chuyên nghiệp cho startup",
  "maxDatabases": 10,
  "maxDataPerCollection": 5000,
  "maxCollectionsPerDatabase": 50,
  "maxStorageGB": 25,
  "maxApiCallsPerDay": 50000,
  "price": 29.99,
  "currency": "USD",
  "isActive": true,
  "displayOrder": 2,
  "metadata": {
    "features": ["Priority Support", "Advanced Analytics"],
    "recommended": true
  }
}
```

### 5. Cập nhật tier (Admin only)

```bash
PUT /v1/tier-config/:tierCode
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (các field đều optional):**

```json
{
  "tierName": "Pro Plus",
  "maxDatabases": 15,
  "price": 39.99,
  "description": "Updated description"
}
```

### 6. Xóa tier - Soft delete (Admin only)

```bash
DELETE /v1/tier-config/:tierCode
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Tier 'pro' has been deleted"
}
```

### 7. Xóa tier vĩnh viễn (Admin only - Cẩn thận!)

```bash
DELETE /v1/tier-config/:tierCode/hard
Authorization: Bearer <token>
```

### 8. Seed default tiers

```bash
POST /v1/tier-config/seed/defaults
Authorization: Bearer <token>
```

Tạo 4 tier mặc định: free, basic, premium, enterprise

## Migration & Setup

### 1. Seed default tiers vào database

Chạy migration script:

```bash
npm run build
node dist/migrations/seed-tier-config.js
```

Hoặc gọi API:

```bash
POST /v1/tier-config/seed/defaults
```

### 2. Kiểm tra tiers đã được tạo

```bash
GET /v1/tier-config
```

## Tích hợp với User

User schema đã được cập nhật để sử dụng `tierCode` thay vì enum:

```typescript
// User schema
{
  tier: string; // 'free', 'basic', 'premium', 'enterprise', hoặc custom tier
}
```

### Upgrade user tier

```bash
POST /v1/tier/upgrade
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**

```json
{
  "userId": "user_id",
  "newTier": "premium",
  "reason": "User upgraded via payment"
}
```

## Use Cases

### 1. Tạo tier custom cho khách hàng doanh nghiệp

```bash
POST /v1/tier-config
```

```json
{
  "tierCode": "vip-enterprise",
  "tierName": "VIP Enterprise",
  "description": "Custom tier for VIP customer",
  "maxDatabases": 100,
  "maxDataPerCollection": 50000,
  "maxCollectionsPerDatabase": 500,
  "maxStorageGB": 500,
  "maxApiCallsPerDay": 1000000,
  "price": 999.99,
  "currency": "USD",
  "isActive": true,
  "displayOrder": 10,
  "metadata": {
    "customerId": "ABC Corp",
    "contractId": "CONTRACT-2024-001",
    "features": ["24/7 Support", "Dedicated Server", "Custom Integration"]
  }
}
```

### 2. Tạo tier thử nghiệm giới hạn thời gian

```bash
POST /v1/tier-config
```

```json
{
  "tierCode": "trial-14days",
  "tierName": "14-Day Trial",
  "description": "Gói dùng thử 14 ngày",
  "maxDatabases": 3,
  "maxDataPerCollection": 500,
  "maxCollectionsPerDatabase": 10,
  "maxStorageGB": 2,
  "maxApiCallsPerDay": 5000,
  "price": 0,
  "currency": "USD",
  "isActive": true,
  "displayOrder": 1,
  "metadata": {
    "trialDays": 14,
    "autoDowngradeTo": "free"
  }
}
```

### 3. Điều chỉnh giới hạn tier theo mùa

```bash
PUT /v1/tier-config/basic
```

```json
{
  "maxDatabases": 10,
  "maxDataPerCollection": 2000,
  "description": "Black Friday Special - Doubled limits!"
}
```

### 4. Tắt tier không còn sử dụng

```bash
PUT /v1/tier-config/old-tier
```

```json
{
  "isActive": false
}
```

## Cache System

Service có built-in cache với TTL 5 phút để giảm tải database. Cache tự động clear khi:

- Tạo tier mới
- Cập nhật tier
- Xóa tier

## Migration từ Enum sang Dynamic Config

### Trước (Enum):

```typescript
// tier.enum.ts
export enum AccountTier {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
}

export const TIER_LIMITS = {
  free: { maxDatabases: 2, ... },
  basic: { maxDatabases: 5, ... },
};
```

### Sau (Dynamic):

- Tất cả tier config lưu trong MongoDB
- Quản lý qua API
- Có thể thêm/sửa/xóa tier bất cứ lúc nào
- Không cần rebuild application

## Best Practices

1. **Đặt tierCode có ý nghĩa**: 'startup-2024', 'enterprise-custom', etc.
2. **Sử dụng displayOrder** để sắp xếp tier trên UI
3. **Lưu thông tin trong metadata**: contract ID, customer info, special features
4. **Soft delete** thay vì hard delete để giữ lịch sử
5. **Kiểm tra tier tồn tại** trước khi assign cho user
6. **Backup tier config** trước khi thay đổi lớn

## Troubleshooting

### Tier not found error

- Kiểm tra tierCode có đúng không (case-sensitive)
- Kiểm tra tier có active không
- Chạy seed script nếu chưa có tier nào

### User still using old enum values

- Chạy migration để update user.tier từ enum sang tierCode
- Đảm bảo tierCode tương ứng đã tồn tại trong database

### Cache issues

- Service tự động refresh cache sau 5 phút
- Cache clear khi có thay đổi tier config

## API Testing với cURL

```bash
# Get all tiers
curl http://localhost:3000/v1/tier-config

# Get specific tier
curl http://localhost:3000/v1/tier-config/premium

# Create tier (cần token)
curl -X POST http://localhost:3000/v1/tier-config \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tierCode": "custom",
    "tierName": "Custom",
    "maxDatabases": 10,
    "maxDataPerCollection": 5000,
    "maxCollectionsPerDatabase": 50,
    "maxStorageGB": 25,
    "maxApiCallsPerDay": 50000,
    "price": 49.99
  }'

# Update tier
curl -X PUT http://localhost:3000/v1/tier-config/custom \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price": 59.99}'

# Delete tier
curl -X DELETE http://localhost:3000/v1/tier-config/custom \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps

1. Chạy migration để seed default tiers
2. Test API endpoints
3. Cập nhật frontend để sử dụng API mới
4. Tạo admin UI để quản lý tiers
5. Setup monitoring cho tier usage
