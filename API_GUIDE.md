# 📚 Hướng Dẫn Sử Dụng Dynamic CMS API

## 🔧 Cấu Hình Cơ Bản

**Base URL:** `http://localhost:3000`

**Database:** MongoDB - `mongodb://localhost:27017/cms-setting-auto`

---

## 📋 1. COLLECTION SCHEMA APIs

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

### 1. Tạo Collection Schema

```bash
POST http://localhost:3000/collection-schemas
Content-Type: application/json

{
  "name": "products",
  "displayName": "Products",
  ...
}
```

### 2. Tạo Document

```bash
POST http://localhost:3000/dynamic-data/products
Content-Type: application/json

{
  "product_name": "iPhone 15",
  "sku": "IPHONE-15",
  "price": 999,
  "category": "electronics",
  "in_stock": true
}
```

### 3. Lấy Danh Sách

```bash
GET http://localhost:3000/dynamic-data/products?page=1&limit=10
```

---

## 📝 Checklist Triển Khai

- [x] DTO validation đầy đủ cho tất cả fields
- [x] Error handling cho 404, 400, 500
- [x] Pagination cho list APIs
- [x] Search functionality
- [x] Soft delete & restore
- [x] Data validation theo schema
- [x] MongoDB connection
- [x] Swagger documentation
- [ ] Authentication/Authorization (cần implement)
- [ ] File upload handling (cần implement)
- [ ] Caching layer (optional)

---

## 🚀 Khởi Động Server

```bash
# Install dependencies
npm install

# Start MongoDB
mongod

# Start NestJS
npm run start:dev

# Server chạy tại
http://localhost:3000

# Swagger API docs
http://localhost:3000/api
```

---

## 📞 Hỗ Trợ

Nếu gặp lỗi, kiểm tra:

1. MongoDB đã chạy chưa
2. .env file có đúng config không
3. Port 3000 có bị chiếm không
4. Check logs trong terminal

**Logs quan trọng:**

- Connection errors → Check MongoDB URI
- Validation errors → Check request body format
- 404 errors → Check collection/document exists
