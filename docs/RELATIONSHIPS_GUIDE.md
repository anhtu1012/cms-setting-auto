# Dynamic CMS với Relationships - Hướng dẫn đầy đủ

## Tổng quan

Hệ thống Dynamic CMS cho phép bạn:

1. **Tạo collection schemas động** - Định nghĩa cấu trúc dữ liệu như tạo bảng trong database
2. **Relationships giữa collections** - Liên kết dữ liệu giữa các collections (1-1, 1-N, N-1, N-N)
3. **Auto-generate REST APIs** - Tự động tạo endpoints CRUD đầy đủ
4. **Populate references** - Tự động load dữ liệu liên quan
5. **Validation tự động** - Validate data theo schema đã định nghĩa

## Kiến trúc hệ thống

```
Database (workspace)
  └── Collection Schemas (users, orders, products...)
       └── Dynamic Data (actual records)
            └── References (relationships between records)
```

## 1. Tạo Database (Workspace)

```bash
POST /databases
Content-Type: application/json

{
  "name": "my-ecommerce",
  "displayName": "My E-commerce Store",
  "description": "E-commerce database with users, products, and orders"
}
```

Response:

```json
{
  "_id": "64abc123...",
  "name": "my-ecommerce",
  "displayName": "My E-commerce Store",
  "userId": "...",
  "createdAt": "2025-12-08T..."
}
```

## 2. Tạo Collection Schemas với Relationships

### 2.1. Collection: Users

```bash
POST /:databaseId/collection-schemas
Content-Type: application/json

{
  "databaseId": "64abc123...",
  "name": "users",
  "displayName": "Users",
  "description": "User accounts",
  "fields": [
    {
      "name": "name",
      "label": "Full Name",
      "type": "string",
      "validation": {
        "required": true,
        "minLength": 2
      },
      "searchable": true,
      "showInList": true
    },
    {
      "name": "email",
      "label": "Email",
      "type": "email",
      "validation": {
        "required": true
      },
      "searchable": true,
      "showInList": true
    },
    {
      "name": "phone",
      "label": "Phone Number",
      "type": "string",
      "showInList": true
    },
    {
      "name": "address",
      "label": "Address",
      "type": "textarea"
    }
  ],
  "timestamps": true,
  "softDelete": true
}
```

### 2.2. Collection: Products

```bash
POST /:databaseId/collection-schemas

{
  "databaseId": "64abc123...",
  "name": "products",
  "displayName": "Products",
  "description": "Product catalog",
  "fields": [
    {
      "name": "product_name",
      "label": "Product Name",
      "type": "string",
      "validation": {
        "required": true
      },
      "searchable": true,
      "showInList": true
    },
    {
      "name": "sku",
      "label": "SKU",
      "type": "string",
      "validation": {
        "required": true
      },
      "showInList": true
    },
    {
      "name": "price",
      "label": "Price",
      "type": "number",
      "validation": {
        "required": true,
        "min": 0
      },
      "showInList": true
    },
    {
      "name": "category",
      "label": "Category",
      "type": "select",
      "options": [
        { "label": "Electronics", "value": "electronics" },
        { "label": "Clothing", "value": "clothing" },
        { "label": "Books", "value": "books" }
      ],
      "searchable": true
    },
    {
      "name": "description",
      "label": "Description",
      "type": "textarea"
    },
    {
      "name": "in_stock",
      "label": "In Stock",
      "type": "boolean",
      "defaultValue": true,
      "showInList": true
    },
    {
      "name": "images",
      "label": "Images",
      "type": "array"
    }
  ]
}
```

### 2.3. Collection: Orders (với Relationships)

```bash
POST /:databaseId/collection-schemas

{
  "databaseId": "64abc123...",
  "name": "orders",
  "displayName": "Orders",
  "description": "Customer orders",
  "fields": [
    {
      "name": "order_number",
      "label": "Order Number",
      "type": "string",
      "validation": {
        "required": true
      },
      "showInList": true
    },
    {
      "name": "customer",
      "label": "Customer",
      "type": "reference",
      "validation": {
        "required": true
      },
      "referenceConfig": {
        "collection": "users",
        "displayField": "name",
        "multiple": false,
        "relationType": "many_to_one",
        "autoPopulate": true,
        "populateFields": ["name", "email", "phone"],
        "populateDepth": 1
      },
      "showInList": true
    },
    {
      "name": "products",
      "label": "Products",
      "type": "reference",
      "validation": {
        "required": true
      },
      "referenceConfig": {
        "collection": "products",
        "displayField": "product_name",
        "multiple": true,
        "relationType": "many_to_many",
        "autoPopulate": true,
        "populateFields": ["product_name", "sku", "price"],
        "populateDepth": 1
      }
    },
    {
      "name": "total_amount",
      "label": "Total Amount",
      "type": "number",
      "validation": {
        "required": true,
        "min": 0
      },
      "showInList": true
    },
    {
      "name": "status",
      "label": "Status",
      "type": "select",
      "options": [
        { "label": "Pending", "value": "pending" },
        { "label": "Processing", "value": "processing" },
        { "label": "Shipped", "value": "shipped" },
        { "label": "Delivered", "value": "delivered" },
        { "label": "Cancelled", "value": "cancelled" }
      ],
      "defaultValue": "pending",
      "showInList": true
    },
    {
      "name": "shipping_address",
      "label": "Shipping Address",
      "type": "textarea"
    },
    {
      "name": "notes",
      "label": "Notes",
      "type": "textarea"
    }
  ]
}
```

## 3. CRUD Operations với Auto-generated APIs

### 3.1. Create (POST)

#### Tạo User:

```bash
POST /:databaseId/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City"
}
```

Response:

```json
{
  "_id": "user123...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City",
  "createdAt": "2025-12-08T...",
  "updatedAt": "2025-12-08T..."
}
```

#### Tạo Products (Bulk Create):

```bash
POST /:databaseId/products/bulk
Content-Type: application/json

[
  {
    "product_name": "iPhone 15 Pro",
    "sku": "IPHONE-15-PRO",
    "price": 999.99,
    "category": "electronics",
    "description": "Latest iPhone model",
    "in_stock": true,
    "images": ["image1.jpg", "image2.jpg"]
  },
  {
    "product_name": "MacBook Pro",
    "sku": "MACBOOK-PRO",
    "price": 1999.99,
    "category": "electronics",
    "description": "Powerful laptop",
    "in_stock": true,
    "images": ["macbook1.jpg"]
  }
]
```

Response:

```json
{
  "success": 2,
  "failed": 0,
  "results": [
    {
      "success": true,
      "data": { "_id": "prod1...", "product_name": "iPhone 15 Pro", ... },
      "index": 0
    },
    {
      "success": true,
      "data": { "_id": "prod2...", "product_name": "MacBook Pro", ... },
      "index": 1
    }
  ]
}
```

#### Tạo Order với References:

```bash
POST /:databaseId/orders
Content-Type: application/json

{
  "order_number": "ORD-2025-001",
  "customer": "user123...",
  "products": ["prod1...", "prod2..."],
  "total_amount": 2999.98,
  "status": "pending",
  "shipping_address": "123 Main St, City",
  "notes": "Express delivery requested"
}
```

Response (với autoPopulate = true):

```json
{
  "_id": "order1...",
  "order_number": "ORD-2025-001",
  "customer": {
    "_id": "user123...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "products": [
    {
      "_id": "prod1...",
      "product_name": "iPhone 15 Pro",
      "sku": "IPHONE-15-PRO",
      "price": 999.99
    },
    {
      "_id": "prod2...",
      "product_name": "MacBook Pro",
      "sku": "MACBOOK-PRO",
      "price": 1999.99
    }
  ],
  "total_amount": 2999.98,
  "status": "pending",
  "shipping_address": "123 Main St, City",
  "notes": "Express delivery requested",
  "createdAt": "2025-12-08T...",
  "updatedAt": "2025-12-08T..."
}
```

### 3.2. Read (GET)

#### Get All với Populate:

```bash
GET /:databaseId/orders?populate=true&populateDepth=1&page=1&limit=10
```

Query Parameters:

- `populate`: true/false - Tự động load references
- `populateDepth`: 1-3 - Độ sâu của nested references
- `page`: Trang hiện tại
- `limit`: Số records mỗi trang
- `search`: Tìm kiếm text (trong các field searchable=true)

Response:

```json
{
  "data": [
    {
      "_id": "order1...",
      "order_number": "ORD-2025-001",
      "customer": {
        "_id": "user123...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "products": [...],
      "total_amount": 2999.98,
      "status": "pending"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

#### Get By ID với Populate:

```bash
GET /:databaseId/orders/order1...?populate=true&populateDepth=2
```

### 3.3. Update (PATCH/PUT)

#### PATCH - Partial Update:

```bash
PATCH /:databaseId/orders/order1...
Content-Type: application/json

{
  "status": "processing",
  "notes": "Payment confirmed"
}
```

#### PUT - Full Replacement:

```bash
PUT /:databaseId/orders/order1...
Content-Type: application/json

{
  "order_number": "ORD-2025-001",
  "customer": "user123...",
  "products": ["prod1..."],
  "total_amount": 999.99,
  "status": "shipped",
  "shipping_address": "456 New St",
  "notes": "Updated address"
}
```

#### Replace All Data:

```bash
PUT /:databaseId/orders/replace-all
Content-Type: application/json

[
  { "order_number": "ORD-001", "customer": "user1...", ... },
  { "order_number": "ORD-002", "customer": "user2...", ... }
]
```

Response:

```json
{
  "deleted": 5,
  "created": 2,
  "failed": 0,
  "results": [...]
}
```

### 3.4. Delete

#### Soft Delete (khuyến nghị):

```bash
DELETE /:databaseId/orders/order1...
```

→ Đặt `deletedAt` timestamp, không xóa thực sự

#### Hard Delete (xóa vĩnh viễn):

```bash
DELETE /:databaseId/orders/order1.../hard
```

#### Restore Soft Deleted:

```bash
POST /:databaseId/orders/order1.../restore
```

### 3.5. Query với Custom Filter

```bash
POST /:databaseId/orders/query
Content-Type: application/json

{
  "filter": {
    "status": "pending",
    "total_amount": { "$gte": 1000 }
  },
  "sort": {
    "createdAt": -1
  },
  "limit": 20,
  "skip": 0
}
```

## 4. Loại Relationships

### 4.1. ONE_TO_ONE (1-1)

Ví dụ: User → Profile

```json
{
  "name": "profile",
  "type": "reference",
  "referenceConfig": {
    "collection": "profiles",
    "displayField": "bio",
    "multiple": false,
    "relationType": "one_to_one"
  }
}
```

### 4.2. ONE_TO_MANY (1-N)

Ví dụ: User → Posts

```json
{
  "name": "posts",
  "type": "reference",
  "referenceConfig": {
    "collection": "posts",
    "displayField": "title",
    "multiple": true,
    "relationType": "one_to_many",
    "cascadeDelete": true
  }
}
```

### 4.3. MANY_TO_ONE (N-1)

Ví dụ: Posts → User (author)

```json
{
  "name": "author",
  "type": "reference",
  "referenceConfig": {
    "collection": "users",
    "displayField": "name",
    "multiple": false,
    "relationType": "many_to_one",
    "inverseSide": "posts"
  }
}
```

### 4.4. MANY_TO_MANY (N-N)

Ví dụ: Posts ↔ Tags

```json
{
  "name": "tags",
  "type": "reference",
  "referenceConfig": {
    "collection": "tags",
    "displayField": "name",
    "multiple": true,
    "relationType": "many_to_many"
  }
}
```

## 5. Populate Configuration

### Basic Populate

```bash
GET /:databaseId/orders/order1...?populate=true
```

### Nested Populate (depth=2)

```bash
GET /:databaseId/orders/order1...?populate=true&populateDepth=2
```

Ví dụ: Order → Customer → Profile (2 levels)

### Select Specific Fields

Cấu hình trong schema:

```json
{
  "referenceConfig": {
    "collection": "users",
    "displayField": "name",
    "populateFields": ["name", "email", "phone"]
  }
}
```

## 6. Validation

### Field Validation

```json
{
  "name": "email",
  "type": "email",
  "validation": {
    "required": true,
    "pattern": "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
  }
}
```

### Reference Validation

Hệ thống tự động validate:

- Reference ID có tồn tại không
- Reference collection có đúng không
- Multiple references có hợp lệ không

## 7. Error Handling

### Validation Error (400)

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": "required",
    "price": "must be greater than 0"
  }
}
```

### Invalid Reference (400)

```json
{
  "statusCode": 400,
  "message": "Invalid reference in field \"customer\": user999..."
}
```

### Not Found (404)

```json
{
  "statusCode": 404,
  "message": "Collection schema \"orders\" not found"
}
```

## 8. Best Practices

### 8.1. Naming Conventions

- **Collection names**: lowercase, plural (`users`, `orders`, `products`)
- **Field names**: snake_case (`product_name`, `total_amount`)
- **Display names**: Title Case (`Product Name`, `Total Amount`)

### 8.2. Performance

- Chỉ populate khi cần thiết
- Giới hạn populateDepth để tránh circular references
- Sử dụng `populateFields` để chỉ lấy fields cần thiết
- Enable `autoPopulate=false` cho references ít dùng

### 8.3. Security

- Luôn validate user ownership
- Sử dụng soft delete thay vì hard delete
- Cẩn thận với cascadeDelete

### 8.4. Data Modeling

- ONE_TO_MANY cho parent-child relationships
- MANY_TO_MANY cho tags, categories
- Avoid deep nesting (> 3 levels)

## 9. Example: Complete E-commerce Flow

```bash
# 1. Create database
POST /databases
{ "name": "my-shop", "displayName": "My Shop" }

# 2. Create schemas
POST /64abc.../collection-schemas  # users
POST /64abc.../collection-schemas  # products
POST /64abc.../collection-schemas  # orders

# 3. Add users
POST /64abc.../users/bulk
[{ "name": "John", "email": "john@example.com" }, ...]

# 4. Add products
POST /64abc.../products/bulk
[{ "product_name": "iPhone", "price": 999 }, ...]

# 5. Create order with references
POST /64abc.../orders
{
  "order_number": "ORD-001",
  "customer": "user123...",
  "products": ["prod1...", "prod2..."],
  "total_amount": 1999,
  "status": "pending"
}

# 6. Get orders with populated data
GET /64abc.../orders?populate=true&populateDepth=1

# 7. Update order status
PATCH /64abc.../orders/order1...
{ "status": "shipped" }

# 8. Query orders
POST /64abc.../orders/query
{
  "filter": { "status": "shipped" },
  "sort": { "createdAt": -1 }
}
```

## 10. API Endpoints Summary

| Method | Endpoint                               | Description               |
| ------ | -------------------------------------- | ------------------------- |
| POST   | `/:databaseId/:collection`             | Create single document    |
| POST   | `/:databaseId/:collection/bulk`        | Create multiple documents |
| PUT    | `/:databaseId/:collection/replace-all` | Replace all data          |
| GET    | `/:databaseId/:collection`             | Get all (với pagination)  |
| GET    | `/:databaseId/:collection/:id`         | Get by ID                 |
| POST   | `/:databaseId/:collection/query`       | Custom query với filter   |
| GET    | `/:databaseId/:collection/count`       | Count documents           |
| PATCH  | `/:databaseId/:collection/:id`         | Partial update            |
| PUT    | `/:databaseId/:collection/:id`         | Full replace              |
| DELETE | `/:databaseId/:collection/:id`         | Soft delete               |
| DELETE | `/:databaseId/:collection/:id/hard`    | Hard delete               |
| POST   | `/:databaseId/:collection/:id/restore` | Restore deleted           |

Tất cả endpoints đều support:

- Query params: `?populate=true&populateDepth=1`
- Pagination: `?page=1&limit=10`
- Search: `?search=keyword`
