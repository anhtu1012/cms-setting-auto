# 📚 Hướng Dẫn Sử Dụng Dynamic CMS API

## 📖 Mục Lục

1. [Cấu Hình Cơ Bản](#-cấu-hình-cơ-bản)
2. [Authentication APIs](#-0-authentication-apis) - Đăng ký, đăng nhập, refresh token
3. [Database APIs](#-05-database-apis-multi-tenant) - Multi-tenant database management
4. [Collection Schema APIs](#-1-collection-schema-apis) - Quản lý schemas (tables)
5. [Dynamic Data APIs](#-2-dynamic-data-apis) - CRUD operations trên data
6. [Users APIs](#-3-users-apis) - Quản lý người dùng
7. [Settings APIs](#-4-settings-apis) - Quản lý cấu hình hệ thống
8. [Content APIs](#-5-content-apis) - Quản lý nội dung
9. [Field Types](#-các-field-types-được-hỗ-trợ)
10. [Common Errors](#-các-lỗi-thường-gặp--cách-sửa)
11. [Testing](#-test-apis-với-postmanthunder-client)
12. [Deployment Checklist](#-checklist-triển-khai)

---

## 🎯 Tổng Quan Hệ Thống

### Kiến Trúc API

```
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Port 3000)                   │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│ Auth Module  │    │  Dynamic CMS     │    │ Core Modules │
│              │    │                  │    │              │
│ - Register   │    │ - Databases      │    │ - Users      │
│ - Login      │    │ - Collections    │    │ - Settings   │
│ - Refresh    │    │ - Dynamic Data   │    │ - Content    │
│ - Logout     │    │                  │    │              │
└──────────────┘    └──────────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   MongoDB        │
                    │ (cms-setting-auto)│
                    └──────────────────┘
```

### Authentication Flow

```
1. POST /auth/register  →  Create User
2. POST /auth/login     →  Get Access Token (15 min) + Refresh Token (7 days)
3. Use Access Token in  →  Authorization: Bearer <token>
4. Token expired?       →  POST /auth/refresh-token
5. POST /auth/logout    →  Revoke Refresh Token (blacklist)
```

### Multi-Tenant Flow

```
1. Login                           →  Get Access Token
2. POST /databases                 →  Create Database (get database._id)
3. POST /collection-schemas        →  Create Schema (with x-database-id header)
4. POST /dynamic-data/:collection  →  Create Documents (with x-database-id header)
```

### API Modules

| Module                 | Endpoint Prefix       | Auth Required | x-database-id Required | Description                      |
| ---------------------- | --------------------- | ------------- | ---------------------- | -------------------------------- |
| **Authentication**     | `/auth`               | ❌            | ❌                     | Register, login, refresh, logout |
| **Databases**          | `/databases`          | ✅            | ❌                     | Multi-tenant database management |
| **Collection Schemas** | `/collection-schemas` | ✅            | ✅                     | Dynamic table/collection schemas |
| **Dynamic Data**       | `/dynamic-data`       | ✅            | ✅                     | CRUD on dynamic collections      |
| **Users**              | `/users`              | ✅            | ❌                     | User management                  |
| **Settings**           | `/settings`           | ✅            | ❌                     | System settings                  |
| **Content**            | `/content`            | ✅            | ❌                     | Content management               |

---

**Base URL:** `http://localhost:3000`

**Database:** MongoDB - `mongodb://localhost:27017/cms-setting-auto`

**Authentication:** JWT Bearer Token (required for all protected routes)

**Multi-Tenant:** Header `x-database-id` (required for collection-schema & dynamic-data APIs)

---

## 🔑 0. AUTHENTICATION APIs

### 0.1. Đăng Ký User

**POST** `/auth/register`

Đăng ký tài khoản người dùng mới.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecureP@ssw0rd",
  "userName": "johndoe",
  "fullName": "John Doe"
}
```

**Response (201 Created):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "674471234567890abcdef999",
    "email": "user@example.com",
    "userName": "johndoe",
    "role": "user"
  }
}
```

**Lỗi:**

- `409 Conflict`: Email hoặc username đã tồn tại
- `400 Bad Request`: Validation failed (email không hợp lệ, password quá yếu, etc.)

---

### 0.2. Đăng Nhập

**POST** `/auth/login`

Đăng nhập vào hệ thống và nhận JWT tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecureP@ssw0rd"
}
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "674471234567890abcdef999",
    "email": "user@example.com",
    "userName": "johndoe",
    "role": "user"
  }
}
```

**Lỗi:**

- `401 Unauthorized`: Email hoặc password không đúng

**Lưu ý:**

- `accessToken`: Có thời hạn 15 phút, dùng để authenticate các API calls
- `refreshToken`: Có thời hạn 7 ngày, dùng để lấy access token mới

---

### 0.3. Refresh Access Token

**POST** `/auth/refresh-token`

Làm mới access token khi token cũ hết hạn.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Lỗi:**

- `401 Unauthorized`: Refresh token không hợp lệ hoặc đã hết hạn

---

### 0.4. Đăng Xuất

**POST** `/auth/logout`

Đăng xuất và revoke refresh token (thêm vào blacklist).

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "message": "Logged out successfully"
}
```

---

## 📊 0.5. DATABASE APIs (Multi-Tenant)

### 0.5.1. Tạo Database Mới

**POST** `/databases`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**

```json
{
  "name": "my-ecommerce-db",
  "displayName": "My E-commerce Database",
  "description": "Database for e-commerce platform"
}
```

**Response (201 Created):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "my-ecommerce-db",
  "displayName": "My E-commerce Database",
  "description": "Database for e-commerce platform",
  "ownerId": "674471234567890abcdef999",
  "isActive": true,
  "createdAt": "2025-11-25T10:00:00.000Z",
  "updatedAt": "2025-11-25T10:00:00.000Z"
}
```

**Lỗi:**

- `409 Conflict`: Tên database đã tồn tại

---

### 0.5.2. Lấy Danh Sách Databases

**GET** `/databases?page=1&limit=10&search=ecommerce`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200 OK):**

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "my-ecommerce-db",
      "displayName": "My E-commerce Database",
      "description": "Database for e-commerce platform",
      "ownerId": "674471234567890abcdef999",
      "isActive": true,
      "createdAt": "2025-11-25T10:00:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### 0.5.3. Lấy Database Theo ID

**GET** `/databases/:id`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200 OK):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "my-ecommerce-db",
  "displayName": "My E-commerce Database",
  "description": "Database for e-commerce platform",
  "ownerId": "674471234567890abcdef999",
  "isActive": true,
  "createdAt": "2025-11-25T10:00:00.000Z",
  "updatedAt": "2025-11-25T10:00:00.000Z"
}
```

**Lỗi:**

- `404 Not Found`: Database không tồn tại
- `403 Forbidden`: Không có quyền truy cập

---

### 0.5.4. Cập Nhật Database

**PUT** `/databases/:id`

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**

```json
{
  "displayName": "My Updated E-commerce Database",
  "description": "Updated description"
}
```

**Response (200 OK):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "my-ecommerce-db",
  "displayName": "My Updated E-commerce Database",
  "description": "Updated description",
  "updatedAt": "2025-11-25T11:00:00.000Z"
}
```

---

### 0.5.5. Xóa Mềm Database (Deactivate)

**DELETE** `/databases/:id`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200 OK):**

```json
{
  "message": "Database deactivated successfully"
}
```

---

### 0.5.6. Xóa Vĩnh Viễn Database

**DELETE** `/databases/:id/permanent`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200 OK):**

```json
{
  "message": "Database permanently deleted"
}
```

**Cảnh báo:** Hành động này sẽ xóa toàn bộ collections và data!

---

## 📋 1. COLLECTION SCHEMA APIs

**Lưu ý:** Tất cả APIs trong phần này yêu cầu:

- **Header:** `Authorization: Bearer <access_token>`
- **Header:** `x-database-id: <database_id>` (ID của database bạn muốn làm việc)

### 1.1. Tạo Collection Schema

**POST** `/collection-schemas`

Tạo một schema mới cho collection động (như tạo table trong database).

**Request Body:**

```json
{
  "name": "products",
  "displayName": "Products",
  "description": "Product catalog management",
  "icon": "shopping-cart",
  "fields": [
    {
      "name": "product_name",
      "label": "Product Name",
      "type": "text",
      "validation": {
        "required": true,
        "minLength": 3,
        "maxLength": 200
      },
      "placeholder": "Enter product name",
      "showInList": true,
      "searchable": true,
      "sortable": true,
      "order": 1
    },
    {
      "name": "sku",
      "label": "SKU",
      "type": "text",
      "validation": {
        "required": true,
        "pattern": "^[A-Z0-9-]+$"
      },
      "placeholder": "PROD-001",
      "helpText": "Stock Keeping Unit",
      "showInList": true,
      "searchable": true,
      "order": 2
    },
    {
      "name": "price",
      "label": "Price",
      "type": "number",
      "validation": {
        "required": true,
        "min": 0
      },
      "showInList": true,
      "sortable": true,
      "order": 3
    },
    {
      "name": "category",
      "label": "Category",
      "type": "select",
      "validation": {
        "required": true
      },
      "options": [
        { "label": "Electronics", "value": "electronics" },
        { "label": "Clothing", "value": "clothing" },
        { "label": "Books", "value": "books" }
      ],
      "showInList": true,
      "searchable": true,
      "order": 4
    },
    {
      "name": "description",
      "label": "Description",
      "type": "textarea",
      "placeholder": "Product description",
      "showInList": false,
      "order": 5
    },
    {
      "name": "tags",
      "label": "Tags",
      "type": "multi_select",
      "options": [
        { "label": "New Arrival", "value": "new" },
        { "label": "Best Seller", "value": "bestseller" },
        { "label": "Sale", "value": "sale" }
      ],
      "showInList": false,
      "order": 6
    },
    {
      "name": "in_stock",
      "label": "In Stock",
      "type": "boolean",
      "defaultValue": true,
      "showInList": true,
      "order": 7
    }
  ],
  "timestamps": true,
  "softDelete": true,
  "enableApi": true
}
```

**Response (201 Created):**

```json
{
  "_id": "674471234567890abcdef123",
  "name": "products",
  "displayName": "Products",
  "description": "Product catalog management",
  "icon": "shopping-cart",
  "fields": [...],
  "version": 1,
  "createdAt": "2025-11-25T10:00:00.000Z",
  "updatedAt": "2025-11-25T10:00:00.000Z"
}
```

**Lỗi phổ biến:**

- `400 Bad Request`: Tên collection đã tồn tại hoặc có field name trùng nhau
- Thiếu decorator validation cho `options[].value` → Đã sửa trong code

---

### 1.2. Lấy Danh Sách Schemas (Phân Trang)

**GET** `/collection-schemas?page=1&limit=10&search=product`

**Query Parameters:**

- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng items/trang (default: 10)
- `search` (optional): Tìm kiếm theo name, displayName, description

**Response (200 OK):**

```json
{
  "data": [
    {
      "_id": "674471234567890abcdef123",
      "name": "products",
      "displayName": "Products",
      "fields": [...],
      "createdAt": "2025-11-25T10:00:00.000Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

---

### 1.3. Lấy Tất Cả Schemas (Không Phân Trang)

**GET** `/collection-schemas/all`

Lấy tất cả schemas, hữu ích cho dropdown/select options.

**Response (200 OK):**

```json
[
  {
    "_id": "674471234567890abcdef123",
    "name": "products",
    "displayName": "Products",
    "fields": [...]
  },
  {
    "_id": "674471234567890abcdef456",
    "name": "blog_posts",
    "displayName": "Blog Posts",
    "fields": [...]
  }
]
```

---

### 1.4. Lấy Schema Theo Name

**GET** `/collection-schemas/by-name/:name`

**Example:** `GET /collection-schemas/by-name/products`

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef123",
  "name": "products",
  "displayName": "Products",
  "description": "Product catalog management",
  "fields": [...]
}
```

**Lỗi:**

- `404 Not Found`: Schema không tồn tại

---

### 1.5. Lấy Schema Theo ID

**GET** `/collection-schemas/:id`

**Example:** `GET /collection-schemas/674471234567890abcdef123`

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef123",
  "name": "products",
  "displayName": "Products",
  "fields": [...]
}
```

---

### 1.6. Cập Nhật Schema

**PATCH** `/collection-schemas/:id`

**Request Body (cập nhật một phần):**

```json
{
  "displayName": "Products Catalog",
  "description": "Updated description",
  "fields": [
    {
      "name": "product_name",
      "label": "Product Name",
      "type": "text",
      "validation": {
        "required": true,
        "minLength": 5,
        "maxLength": 250
      },
      "order": 1
    }
  ]
}
```

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef123",
  "name": "products",
  "displayName": "Products Catalog",
  "version": 2,
  "updatedAt": "2025-11-25T11:00:00.000Z"
}
```

**Lưu ý:**

- Version tự động tăng lên khi update
- Nếu update fields, phải gửi toàn bộ danh sách fields mới

---

### 1.7. Xóa Schema

**DELETE** `/collection-schemas/:id`

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef123",
  "name": "products",
  "message": "Schema deleted successfully"
}
```

**Lưu ý:** Nên kiểm tra xem có dữ liệu nào đang dùng schema này trước khi xóa.

---

### 1.8. Validate Dữ Liệu Theo Schema

**POST** `/collection-schemas/validate/:collectionName`

Kiểm tra dữ liệu có hợp lệ với schema không trước khi tạo/update.

**Example:** `POST /collection-schemas/validate/products`

**Request Body:**

```json
{
  "product_name": "iPhone 15",
  "sku": "IPHONE-15-PRO",
  "price": 999.99,
  "category": "electronics",
  "in_stock": true
}
```

**Response (200 OK) - Valid:**

```json
{
  "valid": true,
  "errors": []
}
```

**Response (200 OK) - Invalid:**

```json
{
  "valid": false,
  "errors": [
    "Field \"Product Name\" must be at least 5 characters",
    "Field \"SKU\" does not match required pattern",
    "Field \"Category\" is required"
  ]
}
```

---

## 📦 2. DYNAMIC DATA APIs

**Lưu ý:** Tất cả APIs trong phần này yêu cầu:

- **Header:** `Authorization: Bearer <access_token>`
- **Header:** `x-database-id: <database_id>` (ID của database bạn muốn làm việc)

### 2.1. Tạo Document Mới

**POST** `/dynamic-data/:collectionName`

Tạo một document (record) mới trong collection động.

**Example:** `POST /dynamic-data/products`

**Request Body:**

```json
{
  "product_name": "iPhone 15 Pro",
  "sku": "IPHONE-15-PRO",
  "price": 999.99,
  "category": "electronics",
  "description": "Latest iPhone with A17 Pro chip",
  "tags": ["new", "bestseller"],
  "in_stock": true
}
```

**Response (201 Created):**

```json
{
  "_id": "674471234567890abcdef789",
  "_collection": "products",
  "_data": {
    "product_name": "iPhone 15 Pro",
    "sku": "IPHONE-15-PRO",
    "price": 999.99,
    "category": "electronics",
    "description": "Latest iPhone with A17 Pro chip",
    "tags": ["new", "bestseller"],
    "in_stock": true
  },
  "createdAt": "2025-11-25T10:30:00.000Z",
  "updatedAt": "2025-11-25T10:30:00.000Z",
  "deletedAt": null
}
```

**Lỗi:**

- `400 Bad Request`: Validation failed
- `404 Not Found`: Collection schema không tồn tại

---

### 2.2. Lấy Danh Sách Documents

**GET** `/dynamic-data/:collectionName?page=1&limit=10&search=iphone`

**Example:** `GET /dynamic-data/products?page=1&limit=10&search=iphone`

**Query Parameters:**

- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng items/trang (default: 10)
- `search` (optional): Tìm kiếm trong các field có `searchable: true`

**Response (200 OK):**

```json
{
  "data": [
    {
      "_id": "674471234567890abcdef789",
      "_collection": "products",
      "_data": {
        "product_name": "iPhone 15 Pro",
        "sku": "IPHONE-15-PRO",
        "price": 999.99,
        "category": "electronics"
      },
      "createdAt": "2025-11-25T10:30:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

**Lưu ý:**

- Chỉ lấy documents chưa bị xóa (deletedAt = null)
- Search chỉ hoạt động trên các field có `searchable: true`

---

### 2.3. Lấy Document Theo ID

**GET** `/dynamic-data/:collectionName/:id`

**Example:** `GET /dynamic-data/products/674471234567890abcdef789`

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef789",
  "_collection": "products",
  "_data": {
    "product_name": "iPhone 15 Pro",
    "sku": "IPHONE-15-PRO",
    "price": 999.99,
    "category": "electronics",
    "description": "Latest iPhone with A17 Pro chip",
    "tags": ["new", "bestseller"],
    "in_stock": true
  },
  "createdAt": "2025-11-25T10:30:00.000Z",
  "updatedAt": "2025-11-25T10:30:00.000Z",
  "deletedAt": null
}
```

**Lỗi:**

- `404 Not Found`: Document không tồn tại hoặc đã bị xóa

---

### 2.4. Cập Nhật Document

**PATCH** `/dynamic-data/:collectionName/:id`

**Example:** `PATCH /dynamic-data/products/674471234567890abcdef789`

**Request Body (cập nhật một phần):**

```json
{
  "price": 899.99,
  "in_stock": false
}
```

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef789",
  "_collection": "products",
  "_data": {
    "product_name": "iPhone 15 Pro",
    "sku": "IPHONE-15-PRO",
    "price": 899.99,
    "category": "electronics",
    "description": "Latest iPhone with A17 Pro chip",
    "tags": ["new", "bestseller"],
    "in_stock": false
  },
  "updatedAt": "2025-11-25T11:30:00.000Z"
}
```

**Lưu ý:**

- Merge data cũ với data mới
- Validate toàn bộ data sau khi merge

---

### 2.4.1. Thay Thế Document (Full Replacement)

**PUT** `/dynamic-data/:collectionName/:id`

**Example:** `PUT /dynamic-data/products/674471234567890abcdef789`

Thay thế toàn bộ document (không merge như PATCH).

**Request Body (toàn bộ data mới):**

```json
{
  "product_name": "iPhone 15 Pro Max",
  "sku": "IPHONE-15-PRO-MAX",
  "price": 1199.99,
  "category": "electronics",
  "description": "Latest iPhone model with larger screen",
  "tags": ["new", "bestseller", "premium"],
  "in_stock": true
}
```

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef789",
  "_collection": "products",
  "_data": {
    "product_name": "iPhone 15 Pro Max",
    "sku": "IPHONE-15-PRO-MAX",
    "price": 1199.99,
    "category": "electronics",
    "description": "Latest iPhone model with larger screen",
    "tags": ["new", "bestseller", "premium"],
    "in_stock": true
  },
  "updatedAt": "2025-11-25T11:35:00.000Z"
}
```

**Lưu ý:** Khác với PATCH, PUT sẽ thay thế toàn bộ document, không giữ lại fields cũ.

---

### 2.5. Xóa Mềm Document (Soft Delete)

**DELETE** `/dynamic-data/:collectionName/:id`

**Example:** `DELETE /dynamic-data/products/674471234567890abcdef789`

Đánh dấu document là đã xóa (set deletedAt = current time) nhưng vẫn giữ trong database.

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef789",
  "_collection": "products",
  "_data": {...},
  "deletedAt": "2025-11-25T12:00:00.000Z"
}
```

**Lưu ý:** Document vẫn tồn tại trong DB, có thể restore lại được.

---

### 2.6. Xóa Vĩnh Viễn Document (Hard Delete)

**DELETE** `/dynamic-data/:collectionName/:id/hard`

**Example:** `DELETE /dynamic-data/products/674471234567890abcdef789/hard`

Xóa document hoàn toàn khỏi database, không thể khôi phục.

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef789",
  "message": "Document permanently deleted"
}
```

**Cảnh báo:** Hành động này không thể hoàn tác!

---

### 2.7. Khôi Phục Document Đã Xóa

**POST** `/dynamic-data/:collectionName/:id/restore`

**Example:** `POST /dynamic-data/products/674471234567890abcdef789/restore`

Khôi phục document đã bị soft delete.

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef789",
  "_collection": "products",
  "_data": {...},
  "deletedAt": null
}
```

---

### 2.8. Query Documents (Tìm Kiếm Nâng Cao)

**POST** `/dynamic-data/:collectionName/query`

**Example:** `POST /dynamic-data/products/query`

**Request Body:**

```json
{
  "filter": {
    "category": "electronics",
    "price": { "$gte": 500, "$lte": 1000 },
    "in_stock": true
  },
  "sort": {
    "price": -1,
    "createdAt": -1
  },
  "limit": 20,
  "skip": 0
}
```

**Response (200 OK):**

```json
[
  {
    "_id": "674471234567890abcdef789",
    "_collection": "products",
    "_data": {
      "product_name": "iPhone 15 Pro",
      "price": 999.99,
      "category": "electronics"
    }
  },
  {
    "_id": "674471234567890abcdef790",
    "_collection": "products",
    "_data": {
      "product_name": "Samsung Galaxy S24",
      "price": 899.99,
      "category": "electronics"
    }
  }
]
```

**MongoDB Query Operators:**

- `$eq`: Bằng
- `$ne`: Không bằng
- `$gt`: Lớn hơn
- `$gte`: Lớn hơn hoặc bằng
- `$lt`: Nhỏ hơn
- `$lte`: Nhỏ hơn hoặc bằng
- `$in`: Trong danh sách
- `$nin`: Không trong danh sách
- `$regex`: Tìm kiếm pattern

---

### 2.9. Đếm Số Lượng Documents

**GET** `/dynamic-data/:collectionName/count`

**Example:** `GET /dynamic-data/products/count`

**Response (200 OK):**

```json
{
  "count": 150
}
```

**Lưu ý:** Chỉ đếm documents chưa bị xóa (deletedAt = null)

---

## 👥 3. USERS APIs

**Lưu ý:** Tất cả APIs yêu cầu **Header:** `Authorization: Bearer <access_token>`

### 3.1. Tạo User Mới

**POST** `/users`

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "SecureP@ssw0rd",
  "userName": "newuser",
  "fullName": "New User",
  "role": "user"
}
```

**Response (201 Created):**

```json
{
  "_id": "674471234567890abcdef888",
  "email": "newuser@example.com",
  "userName": "newuser",
  "fullName": "New User",
  "role": "user",
  "createdAt": "2025-11-25T10:00:00.000Z"
}
```

---

### 3.2. Lấy Danh Sách Users

**GET** `/users?page=1&limit=10&search=john`

**Response (200 OK):**

```json
{
  "data": [
    {
      "_id": "674471234567890abcdef888",
      "email": "john@example.com",
      "userName": "johndoe",
      "fullName": "John Doe",
      "role": "user",
      "createdAt": "2025-11-25T10:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

---

### 3.3. Lấy User Theo ID

**GET** `/users/:id`

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef888",
  "email": "john@example.com",
  "userName": "johndoe",
  "fullName": "John Doe",
  "role": "user",
  "createdAt": "2025-11-25T10:00:00.000Z",
  "updatedAt": "2025-11-25T10:00:00.000Z"
}
```

---

### 3.4. Cập Nhật User

**PATCH** `/users/:id`

**Request Body:**

```json
{
  "fullName": "John Smith",
  "role": "admin"
}
```

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef888",
  "email": "john@example.com",
  "userName": "johndoe",
  "fullName": "John Smith",
  "role": "admin",
  "updatedAt": "2025-11-25T11:00:00.000Z"
}
```

---

### 3.5. Xóa User

**DELETE** `/users/:id`

**Response (200 OK):**

```json
{
  "message": "User deleted successfully"
}
```

---

## ⚙️ 4. SETTINGS APIs

**Lưu ý:** Tất cả APIs yêu cầu **Header:** `Authorization: Bearer <access_token>`

### 4.1. Tạo Setting Mới

**POST** `/settings`

**Request Body:**

```json
{
  "key": "site_name",
  "value": "My Awesome Website",
  "label": "Site Name",
  "description": "The name of the website",
  "category": "general",
  "type": "text",
  "isPublic": true
}
```

**Response (201 Created):**

```json
{
  "_id": "674471234567890abcdef777",
  "key": "site_name",
  "value": "My Awesome Website",
  "label": "Site Name",
  "description": "The name of the website",
  "category": "general",
  "type": "text",
  "isPublic": true,
  "createdAt": "2025-11-25T10:00:00.000Z"
}
```

---

### 4.2. Lấy Danh Sách Settings

**GET** `/settings?page=1&limit=10&search=site`

**Response (200 OK):**

```json
{
  "data": [
    {
      "_id": "674471234567890abcdef777",
      "key": "site_name",
      "value": "My Awesome Website",
      "label": "Site Name",
      "category": "general",
      "type": "text"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

---

### 4.3. Lấy Settings Theo Category

**GET** `/settings/category/:category`

**Example:** `GET /settings/category/general`

**Categories:** `general`, `appearance`, `security`, `notification`, `integration`

**Response (200 OK):**

```json
[
  {
    "_id": "674471234567890abcdef777",
    "key": "site_name",
    "value": "My Awesome Website",
    "label": "Site Name",
    "category": "general"
  },
  {
    "_id": "674471234567890abcdef778",
    "key": "site_description",
    "value": "Welcome to my website",
    "label": "Site Description",
    "category": "general"
  }
]
```

---

### 4.4. Lấy Setting Theo Key

**GET** `/settings/key/:key`

**Example:** `GET /settings/key/site_name`

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef777",
  "key": "site_name",
  "value": "My Awesome Website",
  "label": "Site Name",
  "category": "general"
}
```

---

### 4.5. Lấy Setting Theo ID

**GET** `/settings/:id`

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef777",
  "key": "site_name",
  "value": "My Awesome Website",
  "label": "Site Name",
  "description": "The name of the website",
  "category": "general",
  "type": "text",
  "isPublic": true
}
```

---

### 4.6. Cập Nhật Setting Theo ID

**PATCH** `/settings/:id`

**Request Body:**

```json
{
  "value": "Updated Website Name",
  "description": "Updated description"
}
```

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef777",
  "key": "site_name",
  "value": "Updated Website Name",
  "description": "Updated description",
  "updatedAt": "2025-11-25T11:00:00.000Z"
}
```

---

### 4.7. Cập Nhật Setting Value Theo Key

**PATCH** `/settings/key/:key`

**Example:** `PATCH /settings/key/site_name`

**Request Body:**

```json
{
  "value": "New Site Name"
}
```

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef777",
  "key": "site_name",
  "value": "New Site Name",
  "updatedAt": "2025-11-25T11:00:00.000Z"
}
```

---

### 4.8. Xóa Setting

**DELETE** `/settings/:id`

**Response (200 OK):**

```json
{
  "message": "Setting deleted successfully"
}
```

---

## 📝 5. CONTENT APIs

**Lưu ý:** Tất cả APIs yêu cầu **Header:** `Authorization: Bearer <access_token>`

### 5.1. Tạo Content Mới

**POST** `/content`

**Request Body:**

```json
{
  "title": "Getting Started with NestJS",
  "slug": "getting-started-with-nestjs",
  "body": "This is a comprehensive guide to NestJS...",
  "excerpt": "Learn the basics of NestJS framework",
  "author": "John Doe",
  "status": "published",
  "tags": ["nestjs", "nodejs", "tutorial"],
  "featuredImage": "https://example.com/image.jpg",
  "metaTitle": "Getting Started with NestJS",
  "metaDescription": "Learn NestJS from scratch"
}
```

**Response (201 Created):**

```json
{
  "_id": "674471234567890abcdef666",
  "title": "Getting Started with NestJS",
  "slug": "getting-started-with-nestjs",
  "body": "This is a comprehensive guide to NestJS...",
  "excerpt": "Learn the basics of NestJS framework",
  "author": "John Doe",
  "status": "published",
  "tags": ["nestjs", "nodejs", "tutorial"],
  "viewCount": 0,
  "createdAt": "2025-11-25T10:00:00.000Z"
}
```

---

### 5.2. Lấy Danh Sách Content

**GET** `/content?page=1&limit=10&search=nestjs`

**Response (200 OK):**

```json
{
  "data": [
    {
      "_id": "674471234567890abcdef666",
      "title": "Getting Started with NestJS",
      "slug": "getting-started-with-nestjs",
      "excerpt": "Learn the basics of NestJS framework",
      "author": "John Doe",
      "status": "published",
      "viewCount": 120,
      "createdAt": "2025-11-25T10:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

---

### 5.3. Lấy Content Theo Status

**GET** `/content/status/:status`

**Example:** `GET /content/status/published`

**Status values:** `draft`, `published`, `archived`

**Response (200 OK):**

```json
[
  {
    "_id": "674471234567890abcdef666",
    "title": "Getting Started with NestJS",
    "slug": "getting-started-with-nestjs",
    "status": "published",
    "createdAt": "2025-11-25T10:00:00.000Z"
  }
]
```

---

### 5.4. Lấy Content Theo Slug

**GET** `/content/slug/:slug`

**Example:** `GET /content/slug/getting-started-with-nestjs`

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef666",
  "title": "Getting Started with NestJS",
  "slug": "getting-started-with-nestjs",
  "body": "This is a comprehensive guide to NestJS...",
  "excerpt": "Learn the basics of NestJS framework",
  "author": "John Doe",
  "status": "published",
  "tags": ["nestjs", "nodejs", "tutorial"],
  "viewCount": 120,
  "createdAt": "2025-11-25T10:00:00.000Z"
}
```

---

### 5.5. Lấy Content Theo ID

**GET** `/content/:id`

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef666",
  "title": "Getting Started with NestJS",
  "slug": "getting-started-with-nestjs",
  "body": "This is a comprehensive guide to NestJS...",
  "status": "published",
  "viewCount": 120
}
```

---

### 5.6. Cập Nhật Content

**PATCH** `/content/:id`

**Request Body:**

```json
{
  "title": "Updated: Getting Started with NestJS",
  "body": "Updated content...",
  "status": "published"
}
```

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef666",
  "title": "Updated: Getting Started with NestJS",
  "body": "Updated content...",
  "status": "published",
  "updatedAt": "2025-11-25T11:00:00.000Z"
}
```

---

### 5.7. Tăng View Count

**PATCH** `/content/:id/view`

Tự động tăng view count lên 1 mỗi lần gọi.

**Response (200 OK):**

```json
{
  "_id": "674471234567890abcdef666",
  "title": "Getting Started with NestJS",
  "viewCount": 121,
  "updatedAt": "2025-11-25T11:05:00.000Z"
}
```

---

### 5.8. Xóa Content

**DELETE** `/content/:id`

**Response (200 OK):**

```json
{
  "message": "Content deleted successfully"
}
```

---

## 🎯 Các Field Types Được Hỗ Trợ

| Type           | Description                     | Validation                    |
| -------------- | ------------------------------- | ----------------------------- |
| `text`         | Text input ngắn                 | minLength, maxLength, pattern |
| `textarea`     | Text input nhiều dòng           | minLength, maxLength          |
| `number`       | Số (integer/float)              | min, max, required            |
| `boolean`      | True/False                      | required                      |
| `date`         | Ngày (YYYY-MM-DD)               | required                      |
| `datetime`     | Ngày giờ                        | required                      |
| `email`        | Email validation                | pattern, required             |
| `url`          | URL validation                  | pattern, required             |
| `select`       | Dropdown (single)               | options, required             |
| `multi_select` | Multiple selection              | options                       |
| `radio`        | Radio buttons                   | options, required             |
| `checkbox`     | Checkboxes                      | options                       |
| `file`         | File upload                     | required                      |
| `image`        | Image upload                    | required                      |
| `json`         | JSON object                     | required                      |
| `rich_text`    | HTML editor                     | required                      |
| `reference`    | Reference to another collection | referenceConfig               |
| `array`        | Array of values                 | required                      |

---

## ⚠️ Các Lỗi Thường Gặp & Cách Sửa

### 1. API GET không hoạt động

**Nguyên nhân:**

- MongoDB chưa kết nối
- Collection schema chưa được tạo
- Data không có trong database

**Cách kiểm tra:**

```bash
# Kiểm tra MongoDB
mongosh
use cms-setting-auto
db.collectionschemas.find()
db.dynamicdata.find()
```

### 2. Lỗi validation "property value should not exist"

**Nguyên nhân:** Thiếu decorator `@IsString()` cho `value` trong `SelectOptionDto`

**Đã sửa:** Thêm `@IsString()` và đổi type từ `string | number` → `string`

### 3. API trả về 404 Not Found

**Nguyên nhân:**

- Collection schema không tồn tại
- Document đã bị soft delete
- ID không đúng format MongoDB ObjectId

**Giải pháp:**

- Kiểm tra schema exists: `GET /collection-schemas/by-name/products`
- Kiểm tra ID format: phải là 24 ký tự hex

### 4. Validation failed khi tạo document

**Nguyên nhân:**

- Thiếu required fields
- Giá trị không đúng type
- Giá trị ngoài range (min/max)
- Pattern không match

**Giải pháp:**

- Dùng API validate trước: `POST /collection-schemas/validate/:collectionName`
- Xem chi tiết errors trong response

---

## 🧪 Test APIs với Postman/Thunder Client

### 1. Authentication Flow

```bash
# 1. Đăng ký user
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!@#",
  "userName": "testuser",
  "fullName": "Test User"
}

# 2. Đăng nhập
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!@#"
}
# Lưu lại accessToken và refreshToken
```

### 2. Tạo Database (Multi-Tenant)

```bash
POST http://localhost:3000/databases
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "test-db",
  "displayName": "Test Database",
  "description": "My test database"
}
# Lưu lại _id của database
```

### 3. Tạo Collection Schema

```bash
POST http://localhost:3000/collection-schemas
Authorization: Bearer YOUR_ACCESS_TOKEN
x-database-id: YOUR_DATABASE_ID
Content-Type: application/json

{
  "name": "products",
  "displayName": "Products",
  ...
}
```

### 4. Tạo Document

```bash
POST http://localhost:3000/dynamic-data/products
Authorization: Bearer YOUR_ACCESS_TOKEN
x-database-id: YOUR_DATABASE_ID
Content-Type: application/json

{
  "product_name": "iPhone 15",
  "sku": "IPHONE-15",
  "price": 999,
  "category": "electronics",
  "in_stock": true
}
```

### 5. Lấy Danh Sách

```bash
GET http://localhost:3000/dynamic-data/products?page=1&limit=10
Authorization: Bearer YOUR_ACCESS_TOKEN
x-database-id: YOUR_DATABASE_ID
```

### 6. Tạo Setting

```bash
POST http://localhost:3000/settings
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "key": "site_name",
  "value": "My Website",
  "label": "Site Name",
  "category": "general",
  "type": "text"
}
```

### 7. Tạo Content

```bash
POST http://localhost:3000/content
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "My First Post",
  "slug": "my-first-post",
  "body": "Content here...",
  "status": "published"
}
```

---

## 📝 Checklist Triển Khai

### Authentication & Authorization

- [x] User registration với validation
- [x] User login với JWT tokens
- [x] Refresh token mechanism
- [x] Logout và token blacklist
- [x] JWT authentication guard cho protected routes
- [x] Password hashing với bcrypt

### Multi-Tenant System

- [x] Database management (create, read, update, delete)
- [x] Database ownership verification
- [x] x-database-id header validation
- [x] Soft delete cho databases
- [x] Hard delete cho databases

### Dynamic CMS

- [x] Collection schema management
- [x] Dynamic data CRUD operations
- [x] Field validation theo schema
- [x] Search functionality
- [x] Pagination cho list APIs
- [x] Soft delete & restore
- [x] Hard delete
- [x] Query với MongoDB operators

### Additional Modules

- [x] Users management (CRUD)
- [x] Settings management (CRUD)
- [x] Settings theo category
- [x] Settings theo key
- [x] Content management (CRUD)
- [x] Content theo status (draft/published/archived)
- [x] Content theo slug
- [x] View count tracking

### Technical Features

- [x] DTO validation đầy đủ cho tất cả fields
- [x] Error handling cho 404, 400, 401, 403, 409, 500
- [x] MongoDB connection
- [x] Swagger documentation
- [x] TypeScript strict mode
- [x] Environment variables (.env)

### Security

- [x] JWT authentication
- [x] Password hashing
- [x] Refresh token rotation
- [x] Token blacklist
- [x] Database ownership guards
- [x] Input validation
- [ ] Rate limiting (cần implement)
- [ ] CORS configuration (cần kiểm tra)

### Future Improvements

- [ ] File upload handling
- [ ] Image upload và resize
- [ ] Email notifications
- [ ] Logging system
- [ ] Caching layer (Redis)
- [ ] API versioning
- [ ] WebSocket support
- [ ] Export/Import data
- [ ] Backup/Restore system
- [ ] Analytics dashboard

---

## 🚀 Khởi Động Server

### 1. Cài Đặt Dependencies

```bash
# Install dependencies
npm install
```

### 2. Cấu Hình Environment Variables

Tạo file `.env` trong thư mục root:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/cms-setting-auto

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:3001
```

### 3. Khởi Động MongoDB

```bash
# Start MongoDB service
mongod

# Hoặc với Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Khởi Động NestJS Application

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Watch mode
npm run start:watch
```

### 5. Truy Cập API

**Server:** `http://localhost:3000`

**Swagger API Docs:** `http://localhost:3000/api`

**Health Check:** `GET http://localhost:3000/`

### 6. Kiểm Tra MongoDB Connection

```bash
# Sử dụng mongosh
mongosh
use cms-setting-auto
show collections

# Kiểm tra có data không
db.users.find()
db.databases.find()
db.collectionschemas.find()
```

### 7. Seed Data (Optional)

Bạn có thể tạo script seed để tạo data mẫu:

```bash
# Tạo admin user
POST http://localhost:3000/auth/register
{
  "email": "admin@example.com",
  "password": "Admin123!@#",
  "userName": "admin",
  "fullName": "Admin User",
  "role": "admin"
}
```

---

## 💡 Best Practices & Tips

### 1. Token Management

```javascript
// Client-side: Lưu tokens trong localStorage hoặc secure cookie
localStorage.setItem('accessToken', response.accessToken);
localStorage.setItem('refreshToken', response.refreshToken);

// Thêm interceptor để tự động refresh token khi expired
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token
      const newToken = await refreshAccessToken();
      // Retry request
    }
    return Promise.reject(error);
  },
);
```

### 2. Database Context

```javascript
// Luôn lưu database ID sau khi tạo database
const database = await createDatabase({
  name: 'my-project-db',
  displayName: 'My Project Database',
});
localStorage.setItem('currentDatabaseId', database._id);

// Thêm vào mọi request cần x-database-id
axios.defaults.headers.common['x-database-id'] = database._id;
```

### 3. Error Handling

```javascript
try {
  const response = await api.post('/dynamic-data/products', data);
} catch (error) {
  if (error.response?.status === 400) {
    // Validation errors
    console.error('Validation failed:', error.response.data);
  } else if (error.response?.status === 401) {
    // Token expired, redirect to login
    window.location.href = '/login';
  } else if (error.response?.status === 403) {
    // No access to this database
    alert('You do not have access to this database');
  } else if (error.response?.status === 404) {
    // Resource not found
    alert('Resource not found');
  }
}
```

### 4. Pagination Best Practices

```javascript
// Luôn implement pagination cho list APIs
const fetchProducts = async (page = 1, limit = 20) => {
  const response = await api.get('/dynamic-data/products', {
    params: { page, limit, search: searchTerm },
  });

  return {
    data: response.data.data,
    pagination: {
      total: response.data.total,
      page: response.data.page,
      totalPages: response.data.totalPages,
    },
  };
};
```

### 5. Search Optimization

```javascript
// Debounce search input để tránh gọi API liên tục
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (searchTerm) => {
  const results = await api.get('/dynamic-data/products', {
    params: { search: searchTerm, page: 1, limit: 20 },
  });
  setSearchResults(results.data);
}, 300);
```

### 6. Validation Before Submit

```javascript
// Sử dụng validate API trước khi submit form
const validateBeforeSubmit = async (formData) => {
  const validation = await api.post(
    '/collection-schemas/validate/products',
    formData,
  );

  if (!validation.data.valid) {
    // Show errors to user
    setErrors(validation.data.errors);
    return false;
  }

  // Proceed with creation
  await api.post('/dynamic-data/products', formData);
};
```

### 7. File Upload Pattern (Future)

```javascript
// Pattern cho file upload (khi được implement)
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.url;
};
```

---

## 🔍 Common Use Cases

### Use Case 1: E-commerce Product Management

```javascript
// 1. Tạo product schema
const productSchema = {
  name: 'products',
  displayName: 'Products',
  fields: [
    { name: 'name', label: 'Product Name', type: 'text', validation: { required: true } },
    { name: 'price', label: 'Price', type: 'number', validation: { required: true, min: 0 } },
    { name: 'category', label: 'Category', type: 'select', options: [...] },
    { name: 'in_stock', label: 'In Stock', type: 'boolean', defaultValue: true }
  ]
};

// 2. Tạo products
await api.post('/dynamic-data/products', {
  name: 'iPhone 15',
  price: 999.99,
  category: 'electronics',
  in_stock: true
});

// 3. Query products
const electronics = await api.post('/dynamic-data/products/query', {
  filter: { category: 'electronics', in_stock: true },
  sort: { price: -1 },
  limit: 20
});
```

### Use Case 2: Blog/CMS Management

```javascript
// 1. Tạo blog posts schema
const blogSchema = {
  name: 'blog_posts',
  displayName: 'Blog Posts',
  fields: [
    { name: 'title', type: 'text', validation: { required: true } },
    {
      name: 'slug',
      type: 'text',
      validation: { required: true, pattern: '^[a-z0-9-]+$' },
    },
    { name: 'content', type: 'rich_text', validation: { required: true } },
    { name: 'author', type: 'text' },
    { name: 'published_at', type: 'datetime' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
};

// 2. Publish a post
await api.post('/dynamic-data/blog_posts', {
  title: 'My First Post',
  slug: 'my-first-post',
  content: '<p>Hello world!</p>',
  author: 'John Doe',
  status: 'published',
  published_at: new Date().toISOString(),
});

// 3. Get published posts
const posts = await api.post('/dynamic-data/blog_posts/query', {
  filter: { status: 'published' },
  sort: { published_at: -1 },
});
```

### Use Case 3: Settings Management

```javascript
// 1. Initialize system settings
const settings = [
  { key: 'site_name', value: 'My Website', category: 'general', type: 'text' },
  {
    key: 'site_logo',
    value: '/logo.png',
    category: 'appearance',
    type: 'image',
  },
  {
    key: 'maintenance_mode',
    value: false,
    category: 'general',
    type: 'boolean',
  },
  { key: 'items_per_page', value: 20, category: 'general', type: 'number' },
];

for (const setting of settings) {
  await api.post('/settings', setting);
}

// 2. Get settings by category
const generalSettings = await api.get('/settings/category/general');

// 3. Update setting value
await api.patch('/settings/key/site_name', { value: 'New Site Name' });

// 4. Get specific setting
const siteName = await api.get('/settings/key/site_name');
```

---

## 📊 API Response Examples

### Success Response Structure

```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

### Error Response Structure

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    "Field \"Product Name\" is required",
    "Field \"Price\" must be greater than 0"
  ]
}
```

---

Nếu gặp lỗi, kiểm tra:

1. MongoDB đã chạy chưa
2. .env file có đúng config không
3. Port 3000 có bị chiếm không
4. Check logs trong terminal
5. Access token còn hiệu lực không (15 phút)
6. Database ID có đúng và user có quyền truy cập không

**Logs quan trọng:**

- Connection errors → Check MongoDB URI
- Validation errors → Check request body format
- 404 errors → Check collection/document/database exists
- 401 errors → Check access token (có thể đã expired)
- 403 errors → Check database ownership
- 409 errors → Check duplicate name/email/username

**API Response Status Codes:**

- `200 OK` - Request thành công
- `201 Created` - Tạo mới thành công
- `400 Bad Request` - Validation failed hoặc invalid input
- `401 Unauthorized` - Không có token hoặc token không hợp lệ
- `403 Forbidden` - Không có quyền truy cập resource
- `404 Not Found` - Resource không tồn tại
- `409 Conflict` - Duplicate data (email, username, database name, etc.)
- `500 Internal Server Error` - Lỗi server

**Common Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
x-database-id: YOUR_DATABASE_ID (required for collection-schemas & dynamic-data)
Content-Type: application/json
```

**Workflow đầy đủ:**

1. **Register/Login** → Nhận `accessToken` & `refreshToken`
2. **Create Database** → Nhận `database._id`
3. **Create Collection Schema** (với header `x-database-id`)
4. **Create Documents** trong collection (với header `x-database-id`)
5. **CRUD operations** trên data

**Access Token hết hạn?**

```bash
POST /auth/refresh-token
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

**Kiểm tra Authentication:**

Tất cả protected routes (trừ `/auth/*`) yêu cầu header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Kiểm tra Multi-Tenant:**

Routes `/collection-schemas/*` và `/dynamic-data/*` yêu cầu thêm header:

```
x-database-id: YOUR_DATABASE_ID
```
