# Dynamic CMS Module

## Tổng quan

Dynamic CMS là một hệ thống quản lý nội dung động cho phép tạo bảng (collections), fields, validation và API tự động mà không cần code thêm. Schema có thể thay đổi ở runtime thay vì compile time.

## Kiến trúc

### 1. Database Design

#### Collection Schemas (Meta-Schema)

Lưu trữ định nghĩa cấu trúc của các collection động:

- Tên collection
- Danh sách fields và types
- Validation rules
- Permission config
- API settings

#### Dynamic Data

Lưu trữ dữ liệu thực tế của user:

- `_collection`: Tên collection
- `_data`: Object chứa dữ liệu (flexible schema)
- Timestamps và soft delete support

### 2. Field Types Support

- **Text Types**: text, textarea, rich_text
- **Number Types**: number
- **Boolean**: checkbox, boolean
- **Date/Time**: date, datetime
- **Selection**: select, multi_select, radio, checkbox
- **Media**: file, image
- **Advanced**: json, reference (FK), array
- **Email & URL**: với validation tự động

### 3. Validation Engine

Mỗi field có thể có:

- `required`: Bắt buộc
- `min/max`: Giá trị min/max (số)
- `minLength/maxLength`: Độ dài (text)
- `pattern`: Regex validation
- `enum`: Giá trị được phép
- Type-specific validation (email, URL, etc.)

## API Endpoints

### Schema Management

#### Tạo Collection Schema

```http
POST /collection-schemas
Content-Type: application/json

{
  "name": "products",
  "displayName": "Products",
  "description": "Product catalog",
  "fields": [
    {
      "name": "product_name",
      "label": "Product Name",
      "type": "text",
      "validation": {
        "required": true,
        "minLength": 3,
        "maxLength": 100
      },
      "showInList": true,
      "searchable": true
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
    },
    {
      "name": "description",
      "label": "Description",
      "type": "rich_text"
    },
    {
      "name": "in_stock",
      "label": "In Stock",
      "type": "boolean",
      "defaultValue": true
    }
  ],
  "timestamps": true,
  "softDelete": true,
  "enableApi": true
}
```

#### Get All Schemas

```http
GET /collection-schemas?page=1&limit=10&search=product
```

#### Get Schema by Name

```http
GET /collection-schemas/by-name/products
```

#### Update Schema

```http
PATCH /collection-schemas/:id
Content-Type: application/json

{
  "displayName": "Product Catalog",
  "fields": [...]
}
```

#### Delete Schema

```http
DELETE /collection-schemas/:id
```

#### Validate Data

```http
POST /collection-schemas/validate/products
Content-Type: application/json

{
  "product_name": "iPhone 15",
  "price": 999,
  "category": "electronics"
}
```

### Dynamic Data Management

#### Create Document

```http
POST /dynamic-data/products
Content-Type: application/json

{
  "product_name": "iPhone 15 Pro",
  "price": 1199,
  "category": "electronics",
  "description": "<p>Latest iPhone model</p>",
  "in_stock": true
}
```

#### Get All Documents

```http
GET /dynamic-data/products?page=1&limit=10&search=iphone
```

#### Get Document by ID

```http
GET /dynamic-data/products/:id
```

#### Update Document

```http
PATCH /dynamic-data/products/:id
Content-Type: application/json

{
  "price": 1099,
  "in_stock": false
}
```

#### Soft Delete

```http
DELETE /dynamic-data/products/:id
```

#### Hard Delete (Permanent)

```http
DELETE /dynamic-data/products/:id/hard
```

#### Restore Deleted Document

```http
POST /dynamic-data/products/:id/restore
```

#### Custom Query

```http
POST /dynamic-data/products/query
Content-Type: application/json

{
  "filter": {
    "category": "electronics",
    "price": { "$lt": 1000 }
  },
  "sort": { "price": -1 },
  "limit": 20
}
```

#### Count Documents

```http
GET /dynamic-data/products/count
```

## Usage Examples

### 1. Tạo Collection "Blog Posts"

```typescript
const blogSchema = {
  name: 'blog_posts',
  displayName: 'Blog Posts',
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      validation: { required: true, maxLength: 200 },
      searchable: true,
      showInList: true,
    },
    {
      name: 'slug',
      label: 'URL Slug',
      type: 'text',
      validation: {
        required: true,
        pattern: '^[a-z0-9-]+$',
      },
    },
    {
      name: 'content',
      label: 'Content',
      type: 'rich_text',
      validation: { required: true },
    },
    {
      name: 'author',
      label: 'Author',
      type: 'reference',
      referenceConfig: {
        collection: 'users',
        displayField: 'firstName',
      },
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'multi_select',
      options: [
        { label: 'Technology', value: 'tech' },
        { label: 'Design', value: 'design' },
        { label: 'Business', value: 'business' },
      ],
    },
    {
      name: 'published',
      label: 'Published',
      type: 'boolean',
      defaultValue: false,
    },
    {
      name: 'publish_date',
      label: 'Publish Date',
      type: 'datetime',
    },
  ],
  timestamps: true,
  softDelete: true,
};

// POST /collection-schemas
```

### 2. Thêm Blog Post

```typescript
const newPost = {
  title: 'Getting Started with Dynamic CMS',
  slug: 'getting-started-dynamic-cms',
  content: '<h1>Introduction</h1><p>This is a dynamic CMS...</p>',
  author: '507f1f77bcf86cd799439011', // User ID
  tags: ['tech', 'cms'],
  published: true,
  publish_date: '2025-11-25T10:00:00Z',
};

// POST /dynamic-data/blog_posts
```

### 3. Query Blog Posts

```typescript
// Lấy tất cả posts đã publish
// POST /dynamic-data/blog_posts/query
{
  "filter": { "published": true },
  "sort": { "publish_date": -1 },
  "limit": 10
}

// Search posts
// GET /dynamic-data/blog_posts?search=dynamic&page=1&limit=10
```

## Frontend Integration

### React Example

```typescript
// Fetch schema để render form
const schema = await fetch('/collection-schemas/by-name/products');
const fields = schema.fields;

// Render form dynamically
fields.map(field => {
  switch(field.type) {
    case 'text':
      return <input type="text" name={field.name} placeholder={field.placeholder} />;
    case 'number':
      return <input type="number" name={field.name} min={field.validation?.min} />;
    case 'select':
      return (
        <select name={field.name}>
          {field.options.map(opt => (
            <option value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    // ... other types
  }
});

// Submit data
const handleSubmit = async (data) => {
  await fetch('/dynamic-data/products', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
```

## Lợi ích

1. **Không cần code backend**: Tạo API tự động khi tạo schema
2. **Validation tự động**: Dựa trên field definition
3. **Flexible**: Thay đổi schema runtime
4. **Type-safe**: TypeScript support
5. **Scalable**: MongoDB flexible schema
6. **RESTful API**: Chuẩn REST conventions
7. **Soft delete**: Khôi phục dữ liệu dễ dàng
8. **Search & Filter**: Built-in search và query

## Best Practices

1. **Field naming**: Dùng snake_case cho field names
2. **Validation**: Luôn validate ở backend
3. **Permissions**: Set permissions phù hợp cho mỗi collection
4. **Indexing**: Thêm index cho searchable fields
5. **Soft delete**: Dùng soft delete cho dữ liệu quan trọng
6. **Versioning**: Schema có version tracking tự động

## Roadmap

- [ ] Field dependencies (show field A khi field B = value)
- [ ] Computed fields
- [ ] Webhooks khi data thay đổi
- [ ] Import/Export schema
- [ ] Schema migration tools
- [ ] Real-time validation với WebSocket
- [ ] GraphQL API support
- [ ] File upload handling
- [ ] Relationship management UI
- [ ] Advanced query builder UI
