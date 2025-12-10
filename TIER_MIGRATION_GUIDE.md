# Chuyển đổi từ Tier Enum sang Dynamic Tier Configuration

## Tóm tắt thay đổi

Hệ thống đã được chuyển đổi từ sử dụng **enum cứng** sang **dynamic tier configuration** qua API và database.

### Trước đây (Enum):

```typescript
export enum AccountTier {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

export const TIER_LIMITS = {
  free: { maxDatabases: 2, ... },
  // ... hard-coded limits
};
```

### Bây giờ (Dynamic):

- Tier configuration lưu trong MongoDB collection `tierconfigs`
- Quản lý qua REST API: `/v1/tier-config`
- Có thể thêm/sửa/xóa tier bất cứ lúc nào
- Không cần rebuild application khi thay đổi tier

## Files đã thay đổi

### 1. Schema & Models

- ✅ **NEW**: `src/common/tier/schemas/tier-config.schema.ts` - MongoDB schema cho tier config
- ✅ **UPDATED**: `src/modules/users/schemas/user.schema.ts` - User.tier từ enum → string

### 2. Services

- ✅ **NEW**: `src/common/tier/tier-config.service.ts` - Service quản lý tier config
- ✅ **UPDATED**: `src/common/tier/tier.service.ts` - Sử dụng TierConfigService thay vì enum

### 3. DTOs

- ✅ **NEW**: `src/common/tier/dto/tier-config.dto.ts` - DTO cho CRUD tier config
- ✅ **UPDATED**: `src/common/dto/tier.dto.ts` - Thay AccountTier enum → string

### 4. Controllers & APIs

- ✅ **NEW**: `src/common/tier/tier-config.controller.ts` - API endpoints cho tier management

### 5. Guards

- ✅ **UPDATED**: `src/common/guards/tier-limits.guard.ts` - Sử dụng TierConfigService

### 6. Modules

- ✅ **UPDATED**: `src/common/tier/tier.module.ts` - Import TierConfig schema & service

### 7. Tests

- ✅ **UPDATED**: `src/common/tier/tier.service.spec.ts` - Mock TierConfigService

### 8. Migrations & Docs

- ✅ **NEW**: `src/migrations/seed-tier-config.ts` - Migration script để seed default tiers
- ✅ **NEW**: `docs/API_TIER_CONFIG_GUIDE.md` - Hướng dẫn sử dụng API

## Cách sử dụng

### Bước 1: Seed default tiers vào database

```bash
# Build project
npm run build

# Run migration
node dist/migrations/seed-tier-config.js
```

Hoặc gọi API (cần auth token):

```bash
POST http://localhost:3000/v1/tier-config/seed/defaults
Authorization: Bearer YOUR_TOKEN
```

### Bước 2: Verify tiers đã được tạo

```bash
GET http://localhost:3000/v1/tier-config
```

Response:

```json
[
  {
    "tierCode": "free",
    "tierName": "Free",
    "maxDatabases": 2,
    "maxDataPerCollection": 100,
    ...
  },
  ...
]
```

### Bước 3: Test API

#### Lấy tất cả tiers

```bash
curl http://localhost:3000/v1/tier-config
```

#### Tạo tier mới

```bash
curl -X POST http://localhost:3000/v1/tier-config \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tierCode": "pro",
    "tierName": "Pro",
    "maxDatabases": 10,
    "maxDataPerCollection": 5000,
    "maxCollectionsPerDatabase": 50,
    "maxStorageGB": 25,
    "maxApiCallsPerDay": 50000,
    "price": 29.99
  }'
```

#### Cập nhật tier

```bash
curl -X PUT http://localhost:3000/v1/tier-config/pro \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price": 39.99, "maxDatabases": 15}'
```

#### Xóa tier (soft delete)

```bash
curl -X DELETE http://localhost:3000/v1/tier-config/pro \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Breaking Changes

### User Schema

```typescript
// TRƯỚC
tier: AccountTier; // enum

// SAU
tier: string; // tierCode như 'free', 'basic', 'premium'
```

### Service Methods

```typescript
// TRƯỚC
getTierLimits(user.tier); // Synchronous, từ enum

// SAU
await this.tierConfigService.getTierLimits(user.tier); // Async, từ DB
```

### DTO Validation

```typescript
// TRƯỚC
@IsEnum(AccountTier)
newTier: AccountTier;

// SAU
@IsString()
newTier: string;
```

## Migration cho existing users

Nếu database đã có users với tier enum values, chúng vẫn hoạt động vì:

- Enum values (`'free'`, `'basic'`, etc.) giống với tierCode
- Chỉ cần seed tier configs để có data trong database

```bash
# Users hiện tại không cần update nếu tier values đã đúng
# Ví dụ: user.tier = 'free' sẽ work với tierCode = 'free'
```

Nếu cần migrate users có tier value khác:

```javascript
// Script migration (nếu cần)
db.users.updateMany({ tier: 'OLD_VALUE' }, { $set: { tier: 'NEW_TIER_CODE' } });
```

## Tính năng mới

### 1. Tạo tier custom cho khách hàng đặc biệt

```bash
POST /v1/tier-config
{
  "tierCode": "vip-customer-abc",
  "tierName": "VIP ABC Corp",
  "maxDatabases": 100,
  "maxDataPerCollection": 50000,
  ...
}
```

### 2. Điều chỉnh limits theo mùa/promotion

```bash
PUT /v1/tier-config/basic
{
  "maxDatabases": 10,  // Tăng từ 5 lên 10 trong promotion
  "description": "Black Friday Special - Doubled limits!"
}
```

### 3. Tắt tier không còn dùng

```bash
PUT /v1/tier-config/old-tier
{
  "isActive": false
}
```

### 4. Metadata tùy chỉnh

```bash
POST /v1/tier-config
{
  "tierCode": "enterprise-abc",
  ...
  "metadata": {
    "contractId": "CONTRACT-2024-001",
    "customerId": "ABC Corp",
    "supportLevel": "24/7",
    "dedicatedAccount": true
  }
}
```

## Cache System

TierConfigService có built-in cache:

- **TTL**: 5 phút
- **Auto refresh**: Khi có thay đổi (create/update/delete)
- **Performance**: Giảm tải database, response nhanh hơn

## Rollback Plan

Nếu cần rollback về enum cứng:

1. Restore file `src/common/enums/tier.enum.ts`
2. Revert changes trong:
   - `tier.service.ts`
   - `tier-limits.guard.ts`
   - `user.schema.ts`
   - `tier.dto.ts`
3. Remove tier-config related files
4. Rebuild & deploy

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test tier service
npm run test -- tier.service.spec.ts
```

## Documentation

Chi tiết về API và use cases: **`docs/API_TIER_CONFIG_GUIDE.md`**

## Support

Nếu gặp vấn đề:

1. Check logs cho errors
2. Verify tier configs đã được seed: `GET /v1/tier-config`
3. Check user.tier values trong database
4. Verify TierModule đã được import trong AppModule

## Lợi ích của Dynamic Tier System

✅ **Flexibility**: Tạo tier mới không cần code changes
✅ **Scalability**: Dễ dàng customize cho từng khách hàng
✅ **Maintenance**: Cập nhật limits qua API, không cần redeploy
✅ **Business Agility**: Thay đổi pricing/limits theo market
✅ **Metadata Support**: Lưu thêm thông tin custom
✅ **Audit Trail**: Track tier changes qua database

## Next Steps

1. ✅ Seed default tiers
2. ✅ Test API endpoints
3. 🔲 Update frontend để sử dụng API mới
4. 🔲 Tạo admin UI để quản lý tiers
5. 🔲 Setup monitoring cho tier usage
6. 🔲 Implement tier upgrade workflow
7. 🔲 Add payment integration

---

**Date**: 2024
**Version**: 2.0 (Dynamic Tier System)
