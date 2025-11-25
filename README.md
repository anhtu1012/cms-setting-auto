# CMS Setting Auto - NestJS MongoDB API

## Mô tả

Hệ thống CMS với MongoDB được xây dựng bằng NestJS, bao gồm quản lý users, settings và content.

## Cấu trúc dự án

```
src/
├── config/                 # Cấu hình ứng dụng
│   └── database.config.ts
├── common/                 # Các thành phần dùng chung
│   ├── dto/               # DTOs chung
│   │   └── pagination.dto.ts
│   └── interfaces/        # Interfaces chung
│       └── base.interface.ts
├── modules/               # Các modules chính
│   ├── users/            # Module quản lý người dùng
│   │   ├── schemas/
│   │   │   └── user.schema.ts
│   │   ├── dto/
│   │   │   └── user.dto.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── settings/         # Module quản lý cài đặt
│   │   ├── schemas/
│   │   │   └── setting.schema.ts
│   │   ├── dto/
│   │   │   └── setting.dto.ts
│   │   ├── settings.controller.ts
│   │   ├── settings.service.ts
│   │   └── settings.module.ts
│   └── content/          # Module quản lý nội dung
│       ├── schemas/
│       │   └── content.schema.ts
│       ├── dto/
│       │   └── content.dto.ts
│       ├── content.controller.ts
│       ├── content.service.ts
│       └── content.module.ts
├── app.module.ts
└── main.ts
```

## Tính năng

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

```
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

4. Chạy ứng dụng:

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

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

## Technologies

- NestJS v11
- MongoDB with Mongoose
- TypeScript
- class-validator & class-transformer
- ConfigModule for environment variables

---

## NestJS Documentation

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

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
