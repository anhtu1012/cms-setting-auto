# Hệ Thống Quản Lý Database & Collections Đa Tầng

## 📋 Tổng Quan

Hệ thống cho phép **1 User quản lý nhiều Databases**, mỗi **Database chứa nhiều Collections**, và mỗi **Collection chứa nhiều Data records**.

### Kiến Trúc 3 Tầng:

```
User (Người dùng)
  ├── Database 1 (VD: E-commerce DB)
  │   ├── Collection 1 (Products)
  │   │   ├── Data 1 (iPhone 15)
  │   │   ├── Data 2 (MacBook Pro)
  │   │   └── ...
  │   ├── Collection 2 (Orders)
  │   │   ├── Data 1 (Order #001)
  │   │   └── ...
  │   └── Collection 3 (Customers)
  │
  ├── Database 2 (VD: Blog DB)
  │   ├── Collection 1 (Posts)
  │   ├── Collection 2 (Comments)
  │   └── Collection 3 (Categories)
  │
  └── Database 3 (VD: CRM DB)
      └── ...
```

## 🔑 Tính Năng Chính

### ✅ Ownership & Isolation

- Mỗi user chỉ thấy và quản lý databases của riêng mình
- Collections và data đều được filter theo userId
- Không thể truy cập dữ liệu của user khác

### ✅ Hierarchical Structure

- **Level 1:** Database (Chứa nhiều collections)
- **Level 2:** Collection (Schema/Structure)
- **Level 3:** Data (Actual records)

### ✅ Full CRUD Operations

- Tạo, đọc, cập nhật, xóa cho cả 3 levels
- Soft delete & Hard delete support
- Validation tự động theo schema

## 🚀 API Endpoints

### 1. Database Management APIs

#### 1.1 Tạo Database Mới

```http
POST /databases
Authorization: Bearer {accessToken}

Request Body:
{
  "name": "my-ecommerce-db",
  "displayName": "My E-commerce Database",
  "description": "Main database for e-commerce platform",
  "icon": "🛒",
  "settings": {
    "defaultLanguage": "vi",
    "timezone": "Asia/Ho_Chi_Minh",
    "dateFormat": "DD/MM/YYYY"
  },
  "tags": ["production", "e-commerce"]
}

Response (201):
{
  "id": "507f1f77bcf86cd799439011",
  "name": "my-ecommerce-db",
  "displayName": "My E-commerce Database",
  "userId": "507f191e810c19729de860ea",
  "isActive": true,
  "collectionsCount": 0,
  "dataCount": 0,
  "createdAt": "2023-12-01T10:30:00Z"
}
```

#### 1.2 Lấy Danh Sách Databases

```http
GET /databases?page=1&limit=10&search=ecommerce
Authorization: Bearer {accessToken}

Response (200):
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "my-ecommerce-db",
      "displayName": "My E-commerce Database",
      "collectionsCount": 5,
      "dataCount": 1250
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

#### 1.3 Lấy Database Theo ID

```http
GET /databases/{databaseId}
Authorization: Bearer {accessToken}
```

#### 1.4 Cập Nhật Database

```http
PUT /databases/{databaseId}
Authorization: Bearer {accessToken}

Request Body:
{
  "displayName": "Updated Name",
  "isActive": true
}
```

#### 1.5 Xóa Database (Soft Delete)

```http
DELETE /databases/{databaseId}
Authorization: Bearer {accessToken}
```

#### 1.6 Xóa Database Vĩnh Viễn

```http
DELETE /databases/{databaseId}/permanent
Authorization: Bearer {accessToken}
```

---

### 2. Collection Schema APIs

#### 2.1 Tạo Collection Mới

```http
POST /collections
Authorization: Bearer {accessToken}

Request Body:
{
  "databaseId": "507f1f77bcf86cd799439011",
  "name": "products",
  "displayName": "Products",
  "description": "Product catalog",
  "icon": "📦",
  "fields": [
    {
      "name": "product_name",
      "label": "Product Name",
      "type": "text",
      "validation": {
        "required": true,
        "minLength": 3,
        "maxLength": 200
      }
    },
    {
      "name": "price",
      "label": "Price",
      "type": "number",
      "validation": {
        "required": true,
        "min": 0
      }
    },
    {
      "name": "category",
      "label": "Category",
      "type": "select",
      "options": [
        { "label": "Electronics", "value": "electronics" },
        { "label": "Clothing", "value": "clothing" }
      ]
    }
  ],
  "timestamps": true,
  "softDelete": true,
  "enableApi": true
}

Response (201):
{
  "id": "507f1f77bcf86cd799439012",
  "databaseId": "507f1f77bcf86cd799439011",
  "userId": "507f191e810c19729de860ea",
  "name": "products",
  "displayName": "Products",
  "fields": [...],
  "version": 1
}
```

#### 2.2 Lấy Collections Của Database

```http
GET /collections?databaseId={databaseId}&page=1&limit=10
Authorization: Bearer {accessToken}

Response (200):
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "products",
      "displayName": "Products",
      "dataCount": 125
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10
}
```

#### 2.3 Lấy Collection Theo ID

```http
GET /collections/{collectionId}
Authorization: Bearer {accessToken}
```

#### 2.4 Cập Nhật Collection Schema

```http
PUT /collections/{collectionId}
Authorization: Bearer {accessToken}

Request Body:
{
  "displayName": "Updated Products",
  "fields": [...]
}
```

#### 2.5 Xóa Collection

```http
DELETE /collections/{collectionId}
Authorization: Bearer {accessToken}
```

---

### 3. Dynamic Data APIs

#### 3.1 Tạo Data Record Mới

```http
POST /dynamic-data/{collectionName}?databaseId={databaseId}
Authorization: Bearer {accessToken}

Request Body:
{
  "product_name": "iPhone 15 Pro",
  "price": 999.99,
  "category": "electronics",
  "description": "Latest iPhone model"
}

Response (201):
{
  "_id": "507f1f77bcf86cd799439013",
  "_collection": "products",
  "userId": "507f191e810c19729de860ea",
  "databaseId": "507f1f77bcf86cd799439011",
  "_data": {
    "product_name": "iPhone 15 Pro",
    "price": 999.99,
    "category": "electronics"
  },
  "createdAt": "2023-12-01T10:30:00Z"
}
```

#### 3.2 Lấy Danh Sách Data

```http
GET /dynamic-data/{collectionName}?databaseId={databaseId}&page=1&limit=10
Authorization: Bearer {accessToken}

Response (200):
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "_data": {
        "product_name": "iPhone 15 Pro",
        "price": 999.99
      }
    }
  ],
  "total": 125,
  "page": 1,
  "limit": 10
}
```

#### 3.3 Lấy Data Theo ID

```http
GET /dynamic-data/{collectionName}/{dataId}?databaseId={databaseId}
Authorization: Bearer {accessToken}
```

#### 3.4 Cập Nhật Data

```http
PUT /dynamic-data/{collectionName}/{dataId}?databaseId={databaseId}
Authorization: Bearer {accessToken}

Request Body:
{
  "price": 1099.99,
  "description": "Updated description"
}
```

#### 3.5 Xóa Data (Soft Delete)

```http
DELETE /dynamic-data/{collectionName}/{dataId}?databaseId={databaseId}
Authorization: Bearer {accessToken}
```

#### 3.6 Xóa Data Vĩnh Viễn

```http
DELETE /dynamic-data/{collectionName}/{dataId}/hard?databaseId={databaseId}
Authorization: Bearer {accessToken}
```

---

## 📊 Database Schema

### Database Schema

```typescript
{
  _id: ObjectId
  name: string              // Slug: "my-ecommerce"
  displayName: string       // "My E-commerce"
  description: string
  userId: ObjectId          // Owner
  isActive: boolean
  icon: string
  settings: {
    defaultLanguage: string
    timezone: string
    dateFormat: string
  }
  tags: string[]
  collectionsCount: number
  dataCount: number
  createdAt: Date
  updatedAt: Date
}
```

### Collection Schema

```typescript
{
  _id: ObjectId
  databaseId: ObjectId      // Parent database
  userId: ObjectId          // Owner
  name: string              // "products"
  displayName: string       // "Products"
  description: string
  fields: FieldDefinition[]
  timestamps: boolean
  softDelete: boolean
  enableApi: boolean
  version: number
  dataCount: number
  createdAt: Date
  updatedAt: Date
}
```

### Dynamic Data Schema

```typescript
{
  _id: ObjectId
  userId: ObjectId          // Owner
  databaseId: ObjectId      // Parent database
  _collection: string       // Collection name
  _data: {                  // Flexible data
    product_name: string
    price: number
    ...
  }
  deletedAt: Date
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔐 Security & Ownership

### Kiểm Tra Ownership Tự Động

Tất cả APIs đều kiểm tra:

1. User đã đăng nhập (JWT Token)
2. Database thuộc về user
3. Collection thuộc về database và user
4. Data thuộc về collection, database và user

### Ví Dụ Flow:

```
Client Request → JWT Guard → Extract userId
                ↓
Check Database Ownership (userId matches?)
                ↓
Check Collection Ownership (userId & databaseId match?)
                ↓
Check Data Ownership (userId, databaseId, collectionName match?)
                ↓
Process Request → Return Response
```

---

## 🎯 Use Cases

### Use Case 1: E-commerce Platform

```
Database: "ecommerce-db"
  ├── Collections:
  │   ├── products (name, price, stock, category)
  │   ├── orders (customer, items, total, status)
  │   ├── customers (name, email, phone)
  │   └── reviews (product, rating, comment)
```

### Use Case 2: Blog System

```
Database: "blog-db"
  ├── Collections:
  │   ├── posts (title, content, author, status)
  │   ├── comments (post, user, text)
  │   ├── categories (name, slug)
  │   └── tags (name, color)
```

### Use Case 3: CRM System

```
Database: "crm-db"
  ├── Collections:
  │   ├── contacts (name, company, email, phone)
  │   ├── deals (contact, amount, stage, probability)
  │   ├── tasks (title, assignee, deadline, status)
  │   └── notes (contact, content, attachedFiles)
```

---

## 📈 Best Practices

### 1. Database Naming

- Sử dụng lowercase và hyphens
- Ví dụ: `my-ecommerce-db`, `blog-system`, `crm-production`

### 2. Collection Naming

- Sử dụng plural nouns
- Ví dụ: `products`, `orders`, `customers`

### 3. Field Naming

- Sử dụng snake_case
- Ví dụ: `product_name`, `created_at`, `is_active`

### 4. Tags Usage

- Phân loại databases: `production`, `staging`, `development`
- Phân loại theo dự án: `ecommerce`, `blog`, `crm`

---

## 🔧 Testing Flow

### Step 1: Đăng nhập

```bash
POST /auth/login
{
  "emailOrUsername": "user@example.com",
  "password": "password123"
}
# Lấy accessToken
```

### Step 2: Tạo Database

```bash
POST /databases
Authorization: Bearer {accessToken}
{
  "name": "test-db",
  "displayName": "Test Database"
}
# Lấy databaseId
```

### Step 3: Tạo Collection

```bash
POST /collections
{
  "databaseId": "{databaseId}",
  "name": "products",
  "displayName": "Products",
  "fields": [...]
}
```

### Step 4: Thêm Data

```bash
POST /dynamic-data/products?databaseId={databaseId}
{
  "product_name": "Test Product",
  "price": 99.99
}
```

---

## 📝 Migration Notes

### Nếu đã có dữ liệu cũ:

1. Tất cả collections cần được gán `databaseId` và `userId`
2. Tất cả dynamic data cần được gán `userId` và `databaseId`
3. Chạy migration script để cập nhật dữ liệu hiện tại

---

**Version:** 2.0.0  
**Last Updated:** November 26, 2025  
**Author:** Auto-generated Documentation
