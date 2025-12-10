# 🔐 Hướng Dẫn Sử Dụng Database ID Header

## 📋 Tổng Quan

Tất cả các API liên quan đến **Collection Schema** và **Dynamic Data** bây giờ yêu cầu `databaseId` được truyền qua **HTTP Header** thay vì query parameters.

### ✅ Thay Đổi Chính

| Phần            | Trước                             | Sau                                                |
| --------------- | --------------------------------- | -------------------------------------------------- |
| **Cách truyền** | Query parameter `?databaseId=xxx` | Header `x-database-id: xxx`                        |
| **Validation**  | Chỉ kiểm tra ở service layer      | **Auto-check bằng Guard** trước khi vào controller |
| **Security**    | Kiểm tra thủ công                 | **DatabaseOwnershipGuard** tự động validate        |

---

## 🔧 Các Component Đã Tạo

### 1. **Custom Decorator: `@DatabaseId()`**

📁 `src/common/decorators/database-id.decorator.ts`

```typescript
// Lấy databaseId từ header 'x-database-id'
@DatabaseId() databaseId: string
```

**Chức năng:**

- Tự động lấy giá trị từ header `x-database-id`
- Throw error nếu header không có

---

### 2. **Guard: `DatabaseOwnershipGuard`**

📁 `src/common/guards/database-ownership.guard.ts`

**Chức năng:**

- ✅ Kiểm tra user đã đăng nhập (require JWT Guard trước)
- ✅ Kiểm tra header `x-database-id` có tồn tại không
- ✅ Validate format ObjectId hợp lệ
- ✅ Kiểm tra database có tồn tại không
- ✅ Kiểm tra user có quyền truy cập database đó không
- ✅ Kiểm tra database có active không (`isActive: true`)

**Errors:**

- `403 Forbidden`: Không có quyền hoặc database không tồn tại
- `400 Bad Request`: Thiếu header hoặc format không hợp lệ

---

## 🎯 API Endpoints Đã Được Cập Nhật

### 📦 Collection Schemas APIs

**Base URL:** `/collection-schemas`

#### Headers Required:

```http
Authorization: Bearer {accessToken}
x-database-id: 507f1f77bcf86cd799439011
```

#### Endpoints:

- `POST /collection-schemas` - Tạo collection schema
- `GET /collection-schemas` - Lấy danh sách collections
- `GET /collection-schemas/all` - Lấy tất cả (paginated)
- `GET /collection-schemas/:id` - Lấy theo ID
- `PATCH /collection-schemas/:id` - Cập nhật
- `DELETE /collection-schemas/:id` - Xóa

---

### 📝 Dynamic Data APIs

**Base URL:** `/dynamic-data/:collectionName`

#### Headers Required:

```http
Authorization: Bearer {accessToken}
x-database-id: 507f1f77bcf86cd799439011
```

#### Endpoints:

- `POST /dynamic-data/:collectionName` - Tạo document
- `GET /dynamic-data/:collectionName` - Lấy danh sách documents
- `GET /dynamic-data/:collectionName/:id` - Lấy document theo ID
- `PATCH /dynamic-data/:collectionName/:id` - Cập nhật document
- `DELETE /dynamic-data/:collectionName/:id` - Soft delete
- `DELETE /dynamic-data/:collectionName/:id/hard` - Hard delete
- `POST /dynamic-data/:collectionName/:id/restore` - Restore

---

## 💡 Ví Dụ Sử Dụng

### ✅ ĐÚNG - Sử dụng Header

#### 1. Tạo Collection Schema

```bash
curl -X POST http://localhost:3001/collection-schemas \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "x-database-id: 507f1f77bcf86cd799439011" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "products",
    "displayName": "Products",
    "fields": [...]
  }'
```

**Lưu ý:** Không cần truyền `databaseId` trong body nữa, hệ thống tự lấy từ header.

---

#### 2. Lấy Danh Sách Collections

```bash
curl -X GET "http://localhost:3001/collection-schemas?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "x-database-id: 507f1f77bcf86cd799439011"
```

---

#### 3. Tạo Document

```bash
curl -X POST http://localhost:3001/dynamic-data/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "x-database-id: 507f1f77bcf86cd799439011" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "iPhone 15 Pro",
    "price": 999.99,
    "in_stock": true
  }'
```

---

#### 4. Lấy Documents

```bash
curl -X GET "http://localhost:3001/dynamic-data/products?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "x-database-id: 507f1f77bcf86cd799439011"
```

---

### ❌ SAI - Cách Cũ (Không Còn Hoạt Động)

```bash
# ❌ Không dùng query parameter nữa
curl -X GET "http://localhost:3001/collection-schemas?databaseId=xxx"

# ❌ Không gửi databaseId trong body
curl -X POST http://localhost:3001/collection-schemas \
  -d '{"databaseId": "xxx", "name": "products"}'
```

---

## 🔄 Migration Guide - Cập Nhật Frontend/Client

### JavaScript/TypeScript (Fetch API)

```typescript
// ✅ ĐÚNG - Thêm header x-database-id
const response = await fetch('http://localhost:3001/collection-schemas', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'x-database-id': databaseId, // ← THÊM HEADER NÀY
    'Content-Type': 'application/json',
  },
});
```

---

### Axios

```typescript
// ✅ ĐÚNG - Thêm header x-database-id
const response = await axios.get('/collection-schemas', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'x-database-id': databaseId, // ← THÊM HEADER NÀY
  },
});
```

---

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

function useCollections(databaseId: string) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const response = await fetch('/collection-schemas', {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'x-database-id': databaseId, // ← DATABASE ID TỪ CONTEXT/STATE
        },
      });
      setData(await response.json());
    };

    if (databaseId) fetchCollections();
  }, [databaseId]);

  return data;
}
```

---

## 🛡️ Security Flow

```
Client Request
     ↓
[JwtAuthGuard] → Kiểm tra JWT token, lấy userId
     ↓
[DatabaseOwnershipGuard] → Kiểm tra x-database-id header
     ↓                      Validate format ObjectId
     ↓                      Query database với userId
     ↓                      Kiểm tra isActive = true
     ↓
Controller Method → Nhận databaseId đã validated
     ↓
Service Layer → Xử lý business logic
     ↓
Response
```

**3 Layer Security:**

1. ✅ JWT Authentication
2. ✅ Database Ownership Validation
3. ✅ Service Layer Data Filtering

---

## ⚠️ Lỗi Thường Gặp

### 1. `400 Bad Request: Database ID is required in header x-database-id`

**Nguyên nhân:** Không gửi header `x-database-id`

**Giải pháp:**

```typescript
headers: {
  'x-database-id': '507f1f77bcf86cd799439011'  // ← THÊM HEADER NÀY
}
```

---

### 2. `400 Bad Request: Invalid Database ID format`

**Nguyên nhân:** `databaseId` không phải ObjectId hợp lệ (24 ký tự hex)

**Giải pháp:** Đảm bảo databaseId có format:

```typescript
// ✅ ĐÚNG: 24 ký tự hex
'507f1f77bcf86cd799439011';

// ❌ SAI
'abc123';
'not-valid-id';
```

---

### 3. `403 Forbidden: Database not found or you do not have access`

**Nguyên nhân:**

- Database không tồn tại
- Database không thuộc về user hiện tại
- Database đã bị deactivate (`isActive: false`)

**Giải pháp:**

1. Kiểm tra `databaseId` có đúng không
2. Đảm bảo user đã tạo database đó
3. Kiểm tra database có active không

---

## 📊 Swagger Documentation

Swagger đã được cập nhật với:

✅ `@ApiHeader` documentation cho `x-database-id`
✅ Loại bỏ `@ApiQuery` cho `databaseId`
✅ Ví dụ giá trị ObjectId hợp lệ

**Truy cập Swagger:** `http://localhost:3001/api`

---

## 🧪 Testing

### Test với cURL

```bash
# 1. Login để lấy token
TOKEN=$(curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  | jq -r '.accessToken')

# 2. Lấy databaseId của user (tạo trước nếu chưa có)
DATABASE_ID="507f1f77bcf86cd799439011"

# 3. Test API với header
curl -X GET http://localhost:3001/collection-schemas \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-database-id: $DATABASE_ID"
```

---

## 🎓 Best Practices

### 1. **Lưu trữ Database ID trong Frontend State**

```typescript
// Context hoặc Redux store
interface AppContext {
  user: User;
  currentDatabaseId: string; // ← Lưu database hiện tại
  databases: Database[];
}
```

---

### 2. **Tạo Axios Interceptor**

```typescript
// axios-config.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// Auto-inject headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const databaseId = localStorage.getItem('currentDatabaseId');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (databaseId) {
    config.headers['x-database-id'] = databaseId; // ← AUTO INJECT
  }

  return config;
});

export default api;
```

---

### 3. **Validate trước khi gọi API**

```typescript
function validateDatabaseId(databaseId: string): boolean {
  // ObjectId là 24 ký tự hex
  return /^[0-9a-fA-F]{24}$/.test(databaseId);
}

// Sử dụng
if (!validateDatabaseId(databaseId)) {
  throw new Error('Invalid database ID format');
}
```

---

## 📝 Checklist Migration

- [ ] Cập nhật tất cả API calls thêm header `x-database-id`
- [ ] Loại bỏ query parameter `?databaseId=xxx`
- [ ] Loại bỏ `databaseId` trong request body (nếu có)
- [ ] Test tất cả endpoints với Postman/Swagger
- [ ] Cập nhật error handling cho 403/400 mới
- [ ] Thêm validation `x-database-id` ở frontend
- [ ] Cập nhật documentation/README

---

## 🔗 Related Files

- `src/common/decorators/database-id.decorator.ts` - Decorator lấy database ID
- `src/common/guards/database-ownership.guard.ts` - Guard validate ownership
- `src/modules/dynamic-cms/controller/collection-schema/collection-schema.controller.ts`
- `src/modules/dynamic-cms/controller/dynamic-data/dynamic-data.controller.ts`
- `src/modules/dynamic-cms/dynamic-cms.module.ts`

---

## 🚀 Summary

### Ưu Điểm Của Cách Mới:

✅ **Bảo mật cao hơn:** Guard tự động kiểm tra ownership trước khi vào controller
✅ **Rõ ràng hơn:** Header rõ ràng là metadata, không lẫn với query params
✅ **DRY principle:** Không cần check ownership ở mỗi service method
✅ **Type-safe:** Decorator đảm bảo databaseId luôn có giá trị
✅ **Consistent:** Tất cả APIs đều dùng cách giống nhau

### Lợi Ích:

- 🛡️ Tự động validate user có quyền truy cập database
- 🚫 Ngăn chặn user truy cập database của người khác
- ⚡ Performance: Check 1 lần ở guard thay vì mỗi service call
- 📝 Code sạch hơn: Controller không cần quan tâm validation logic

---

**Câu Hỏi?** Liên hệ team backend hoặc xem thêm trong Swagger documentation.
