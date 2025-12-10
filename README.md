# CMS Setting Auto - NestJS MongoDB API

## Mô tả

Hệ thống CMS với MongoDB được xây dựng bằng NestJS, bao gồm:

- **Static Modules**: Quản lý users, settings và content
- **Dynamic CMS**: Hệ thống CMS động cho phép tạo bảng, trường và API tại runtime

## ⭐ Tính năng chính

### 🎯 Dynamic CMS

- **Tạo schema động**: Định nghĩa cấu trúc bảng qua API mà không cần code
- **18 loại field**: text, number, email, select, reference, richtext, image, file...
- **Validation động**: Tự động validate dữ liệu theo schema đã định nghĩa
- **Auto CRUD API**: Tự động sinh API endpoints cho collection
- **Soft Delete**: Xóa mềm với khả năng khôi phục
- **Search & Filter**: Tìm kiếm và lọc dữ liệu linh hoạt

👉 [Xem tài liệu chi tiết Dynamic CMS](./DYNAMIC_CMS.md)

## Cấu trúc dự án

```
src/
├── config/                 # Cấu hình ứng dụng
│   └── database.config.ts
├── common/                 # Các thành phần dùng chung
│   ├── dto/
│   │   └── pagination.dto.ts
│   └── interfaces/
│       └── base.interface.ts
├── modules/
│   ├── users/            # Module quản lý người dùng
│   ├── settings/         # Module quản lý cài đặt
│   ├── content/          # Module quản lý nội dung
│   └── dynamic-cms/      # 🆕 Dynamic CMS Module
│       ├── interfaces/
│       │   └── field-types.interface.ts
│       ├── schemas/
│       │   ├── collection-schema.schema.ts
│       │   └── dynamic-data.schema.ts
│       ├── dto/
│       │   ├── collection-schema.dto.ts
│       │   └── dynamic-data.dto.ts
│       ├── collection-schema.controller.ts
│       ├── collection-schema.service.ts
│       ├── dynamic-data.controller.ts
│       ├── dynamic-data.service.ts
│       └── dynamic-cms.module.ts
├── app.module.ts
└── main.ts

examples/                   # Ví dụ sử dụng
├── collection-schemas.json # Schema mẫu
└── seed-schemas.ts        # Script seed dữ liệu
```

## Tính năng

### Dynamic CMS Module 🆕

**Tạo collection động:**

```bash
POST /collection-schemas
{
  "name": "products",
  "displayName": "Sản phẩm",
  "fields": [
    {
      "name": "product_name",
      "label": "Tên sản phẩm",
      "type": "text",
      "validation": { "required": true }
    },
    {
      "name": "price",
      "label": "Giá",
      "type": "number",
      "validation": { "required": true, "min": 0 }
    }
  ]
}
```

**Thao tác dữ liệu:**

```bash
# Tạo sản phẩm
POST /dynamic-data/products
{
  "product_name": "iPhone 15",
  "price": 25000000
}

# Lấy danh sách
GET /dynamic-data/products?page=1&limit=10

# Cập nhật
PATCH /dynamic-data/products/{id}

# Xóa mềm
DELETE /dynamic-data/products/{id}
```

### Users Module

- CRUD operations cho người dùng
- Phân quyền: admin, user, editor
- Tìm kiếm và phân trang
- Quản lý trạng thái active/inactive

### Settings Module

- Quản lý cài đặt hệ thống
- Phân loại theo category: general, appearance, security, notification, integration
- Tìm kiếm theo key hoặc category
- Hỗ trợ public/system settings

### Content Module

- Quản lý nội dung với rich text
- Trạng thái: draft, published, archived
- Tags và categories
- View counter
- Featured image
- SEO metadata
- Liên kết với author (User)

## Cài đặt

1. Cài đặt dependencies:

```bash
npm install
```

2. Cấu hình môi trường trong file `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/cms-setting-auto
PORT=3000
```

3. Khởi động MongoDB (nếu chưa chạy):

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

4. Chạy migrations (Bắt buộc):

```bash
# Seed default tier configurations
npm run migration:tier

# Nếu có users hiện có, thêm tier cho họ
npm run migration:run add-tier-to-users
```

5. Chạy ứng dụng:

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

6. (Optional) Seed dữ liệu mẫu cho Dynamic CMS:

```bash
ts-node examples/seed-schemas.ts
```

## 🔄 Migrations

Hệ thống sử dụng migration scripts để setup và update database.

### Quick Commands

```bash
# Seed tier configurations (free, basic, premium, enterprise)
npm run migration:tier

# Add tier field to existing users
npm run migration:run add-tier-to-users

# Run any migration
npm run migration:run <migration-name>
```

### Using Makefile (Alternative)

```bash
# Run tier migration
make migration-tier

# Run user migration
make migration-users

# Run all migrations
make migration-all
```

👉 [Xem hướng dẫn chi tiết về Migrations](./docs/MIGRATION_GUIDE.md)

## 📚 API Endpoints

### 🔥 Dynamic CMS

#### Collection Schema Management

- `POST /collection-schemas` - Tạo collection schema mới
- `GET /collection-schemas` - Lấy danh sách schemas (có phân trang)
- `GET /collection-schemas/by-name/:name` - Lấy schema theo tên
- `POST /collection-schemas/validate/:name` - Validate dữ liệu theo schema

#### Dynamic Data Operations

- `POST /dynamic-data/:collectionName` - Tạo document mới
- `GET /dynamic-data/:collectionName` - Lấy danh sách documents
- `GET /dynamic-data/:collectionName/:id` - Lấy document theo ID
- `PATCH /dynamic-data/:collectionName/:id` - Cập nhật document
- `DELETE /dynamic-data/:collectionName/:id` - Xóa mềm document
- `DELETE /dynamic-data/:collectionName/:id/hard` - Xóa vĩnh viễn
- `PATCH /dynamic-data/:collectionName/:id/restore` - Khôi phục document
- `POST /dynamic-data/:collectionName/query` - Query tùy chỉnh

### Users

- `POST /users` - Tạo user mới
- `GET /users` - Lấy danh sách users (có phân trang)
- `GET /users/:id` - Lấy thông tin user
- `PATCH /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user

### Settings

- `POST /settings` - Tạo setting mới
- `GET /settings` - Lấy danh sách settings (có phân trang)
- `GET /settings/:id` - Lấy setting theo ID
- `GET /settings/key/:key` - Lấy setting theo key
- `GET /settings/category/:category` - Lấy settings theo category
- `PATCH /settings/:id` - Cập nhật setting
- `PATCH /settings/key/:key` - Cập nhật setting theo key
- `DELETE /settings/:id` - Xóa setting

### Content

- `POST /content` - Tạo content mới
- `GET /content` - Lấy danh sách content (có phân trang)
- `GET /content/:id` - Lấy content theo ID
- `GET /content/slug/:slug` - Lấy content theo slug
- `GET /content/status/:status` - Lấy content theo status
- `PATCH /content/:id` - Cập nhật content
- `PATCH /content/:id/view` - Tăng view count
- `DELETE /content/:id` - Xóa content

## Query Parameters cho Pagination

```
?page=1&limit=10&search=keyword
```

## 📖 Swagger Documentation

Truy cập Swagger UI tại: `http://localhost:3000/api`

## 🛠 Technologies

- **NestJS v11** - Progressive Node.js framework
- **MongoDB** with Mongoose - NoSQL database
- **TypeScript** - Type safety
- **class-validator** & **class-transformer** - Validation & transformation
- **@nestjs/swagger** - OpenAPI documentation
- **@nestjs/config** - Environment configuration

## 📂 Tài liệu chi tiết

- [DYNAMIC_CMS.md](./DYNAMIC_CMS.md) - Hướng dẫn chi tiết về Dynamic CMS
- [examples/collection-schemas.json](./examples/collection-schemas.json) - Schema mẫu
- [examples/seed-schemas.ts](./examples/seed-schemas.ts) - Script seed dữ liệu

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

## 📝 License

This project is MIT licensed.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
