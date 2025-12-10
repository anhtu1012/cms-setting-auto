# API Routes Constants

File quản lý tập trung tất cả các route paths trong ứng dụng.

## Vị trí

`src/common/constants/api-routes.constants.ts`

## Cấu trúc

### 1. API Version

```typescript
export const API_VERSION = 'v1';
```

### 2. Route Groups

#### Auth Routes

```typescript
export const AUTH_ROUTES = {
  BASE: 'v1/auth',
  LOGIN: 'login',
  REGISTER: 'register',
  LOGOUT: 'logout',
  REFRESH: 'refresh',
};
```

#### User Routes

```typescript
export const USER_ROUTES = {
  BASE: 'v1/users',
  PROFILE: 'profile',
  BY_ID: ':id',
};
```

#### Database Routes

```typescript
export const DATABASE_ROUTES = {
  BASE: 'v1/databases',
  BY_ID: ':id',
  PERMANENT_DELETE: ':id/permanent',
};
```

#### Tier Routes

```typescript
export const TIER_ROUTES = {
  BASE: 'v1/tier',
  INFO: 'info',
  CHECK_DATABASE_LIMIT: 'check-database-limit',
  CHECK_DATA_LIMIT: 'check-data-limit/:databaseId/:collectionName',
  USAGE: 'usage',
  USAGE_BY_DATABASE: 'usage/:databaseId',
  UPGRADE: 'upgrade',
};
```

#### Dynamic Data Routes

```typescript
export const DYNAMIC_DATA_ROUTES = {
  BASE: 'v1/:databaseId/:collectionName',
  BULK: 'v1/:databaseId/:collectionName/bulk',
  REPLACE_ALL: 'v1/:databaseId/:collectionName/replace-all',
  BY_ID: 'v1/:databaseId/:collectionName/:id',
};
```

### 3. Route Patterns (Dùng cho Guards)

```typescript
export const ROUTE_PATTERNS = {
  DATABASE_CREATE: '/v1/databases',
  DATA_CREATE: '/:databaseId/:collectionName',
  DATA_BULK_CREATE: '/:databaseId/:collectionName/bulk',
  DATA_REPLACE_ALL: '/:databaseId/:collectionName/replace-all',
  DATA_CREATE_V1: '/v1/:databaseId/:collectionName',
  DATA_BULK_CREATE_V1: '/v1/:databaseId/:collectionName/bulk',
  DATA_REPLACE_ALL_V1: '/v1/:databaseId/:collectionName/replace-all',
};
```

## Cách sử dụng

### Trong Controllers

```typescript
import { AUTH_ROUTES } from '../../common/constants/api-routes.constants';

@Controller(AUTH_ROUTES.BASE)
export class AuthController {
  @Post(AUTH_ROUTES.LOGIN)
  async login() { ... }
}
```

### Trong Guards

```typescript
import { ROUTE_PATTERNS } from '../constants/api-routes.constants';

@Injectable()
export class TierLimitsGuard implements CanActivate {
  private isDatabaseCreation(method: string, path: string): boolean {
    return method === 'POST' && path === ROUTE_PATTERNS.DATABASE_CREATE;
  }
}
```

### Helper Functions

#### buildRoute

Xây dựng full route path:

```typescript
const route = buildRoute('v1', 'users', 'profile');
// Result: '/v1/users/profile'
```

#### matchesRoute

Kiểm tra path có khớp với pattern:

```typescript
const matches = matchesRoute('/v1/databases', ROUTE_PATTERNS.DATABASE_CREATE);
// Result: true
```

## Lợi ích

1. **Tập trung quản lý**: Tất cả routes ở một nơi, dễ tìm và sửa
2. **Type-safe**: TypeScript kiểm tra lỗi compile-time
3. **Dễ bảo trì**: Thay đổi route chỉ cần sửa 1 chỗ
4. **Tránh typo**: Không phải gõ tay string routes
5. **Refactor dễ dàng**: IDE hỗ trợ tìm và thay thế

## Cập nhật Route

Khi thêm route mới:

1. Thêm vào group tương ứng trong `api-routes.constants.ts`
2. Cập nhật controller sử dụng constant
3. Nếu cần check trong guard, thêm vào `ROUTE_PATTERNS`

## Example: Thêm route mới

```typescript
// 1. Thêm vào constants
export const USER_ROUTES = {
  BASE: 'v1/users',
  PROFILE: 'profile',
  BY_ID: ':id',
  SETTINGS: 'settings', // NEW
};

// 2. Sử dụng trong controller
@Get(USER_ROUTES.SETTINGS)
async getUserSettings() { ... }
```
