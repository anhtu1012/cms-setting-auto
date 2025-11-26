# Hệ Thống Authentication API - Tài Liệu Tổng Hợp

## 📁 Cấu Trúc Dự Án

### Auth Module

```
src/modules/auth/
├── dto/
│   ├── auth-request.dto.ts      # Request DTOs cho Login, Register, RefreshToken
│   └── auth-response.dto.ts     # Response DTOs cho Login, Register, RefreshToken
├── handlers/
│   ├── login.handler.ts         # Handler xử lý logic đăng nhập
│   ├── register.handler.ts      # Handler xử lý logic đăng ký
│   └── refresh-token.handler.ts # Handler xử lý refresh token
├── strategies/
│   └── jwt.strategy.ts          # JWT Strategy cho Passport
├── guards/
│   └── jwt-auth.guard.ts        # Guard bảo vệ các protected routes
├── auth.controller.ts           # Controller định nghĩa API endpoints
├── auth.service.ts              # Service điều phối các handlers
└── auth.module.ts               # Module configuration
```

### User Module (Đã Cập Nhật)

```
src/modules/users/
├── schemas/
│   └── user.schema.ts           # User schema với userName, points, wallet
├── dto/
│   └── user.dto.ts              # User DTOs đã cập nhật
├── users.controller.ts
├── users.service.ts
└── users.module.ts
```

## 🎯 Kiến Trúc API

Mỗi API endpoint tuân theo kiến trúc rõ ràng:

```
Client Request
    ↓
Controller (Route handler)
    ↓
Service (Business logic orchestration)
    ↓
Handler (Specific business logic)
    ↓
Response DTO (Format response)
    ↓
Client Response
```

### Ví dụ: Login API Flow

1. **Client** gửi POST request đến `/auth/login`
2. **AuthController.login()** nhận request
3. **AuthService.login()** validate và điều phối
4. **LoginHandler.execute()** xử lý logic đăng nhập, tạo JWT tokens
5. **LoginResponseDto** format dữ liệu trả về
6. **Client** nhận access token và user info

## 🔐 API Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "userName": "johndoe",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "userName": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "points": 0,
    "walletBalance": 0
  }
}
```

### 2. Login

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "emailOrUsername": "johndoe",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "userName": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "points": 100,
    "walletBalance": 500.5,
    "lastLogin": "2023-12-01T10:30:00Z"
  },
  "expiresIn": 3600
}
```

### 3. Refresh Token

**Endpoint:** `POST /auth/refresh-token`

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

## 👤 User Schema Updates

User model đã được mở rộng với các trường mới:

```typescript
{
  email: string;           // Email (unique)
  userName: string;        // Username (unique)
  password: string;        // Hashed password
  firstName: string;
  lastName: string;
  role: string;           // 'admin' | 'user' | 'editor'
  isActive: boolean;
  avatar?: string;
  lastLogin?: Date;

  // NEW FIELDS
  points: number;         // Điểm tích lũy
  walletBalance: number;  // Số dư ví
  walletTransactions: [{  // Lịch sử giao dịch ví
    date: Date;
    amount: number;
    type: string;         // 'credit' | 'debit'
    description: string;
  }];
  pointsHistory: [{       // Lịch sử điểm
    date: Date;
    points: number;
    reason: string;
  }];
}
```

## 🔒 Bảo Vệ Routes với JWT Guard

### Cách sử dụng:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/protected')
export class ProtectedController {
  // Protected route - yêu cầu JWT token
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return {
      user: req.user, // Contains: userId, email, userName, role
    };
  }

  // Public route - không cần token
  @Get('public')
  getPublicData() {
    return { message: 'This is public' };
  }
}
```

### Gửi Request với JWT Token:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     http://localhost:3000/api/protected/profile
```

## ⚙️ Configuration

### 1. Environment Variables

Tạo file `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/cms-setting-auto
JWT_SECRET=your-super-secret-key-change-this-in-production
PORT=3000
NODE_ENV=development
```

### 2. Dependencies Installed

```json
{
  "bcrypt": "^5.x.x",
  "@types/bcrypt": "^5.x.x",
  "@nestjs/jwt": "^10.x.x",
  "@nestjs/passport": "^10.x.x",
  "passport": "^0.6.x",
  "passport-jwt": "^4.x.x",
  "@types/passport-jwt": "^3.x.x"
}
```

## 🚀 Usage

### 1. Start Development Server

```bash
npm run start:dev
```

### 2. Access Swagger Documentation

```
http://localhost:3000/api
```

### 3. Test Authentication Flow

#### Step 1: Register a new user

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "userName": "testuser",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### Step 2: Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "testuser",
    "password": "password123"
  }'
```

#### Step 3: Use Access Token

```bash
curl -X GET http://localhost:3000/api/protected-route \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔑 JWT Token Details

### Access Token

- **Expires in:** 1 hour
- **Contains:** userId, email, userName, role
- **Used for:** API authentication

### Refresh Token

- **Expires in:** 7 days
- **Contains:** Same as access token
- **Used for:** Getting new access tokens without re-login

## 🛡️ Security Features

1. **Password Hashing:** Bcrypt với 10 salt rounds
2. **JWT Authentication:** Token-based auth với expiration
3. **Protected Routes:** JwtAuthGuard cho sensitive endpoints
4. **Unique Constraints:** Email và userName phải unique
5. **Account Status:** isActive flag để disable accounts

## 📊 Error Responses

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Email already exists"
}
```

## 🎨 Best Practices Implemented

1. **Separation of Concerns:** Controller → Service → Handler
2. **DTO Validation:** class-validator cho input validation
3. **Type Safety:** TypeScript với strict typing
4. **Clean Architecture:** Mỗi layer có responsibility riêng
5. **Swagger Documentation:** Auto-generated API docs
6. **Error Handling:** Consistent error responses

## 📝 Next Steps

1. Thêm role-based access control (RBAC)
2. Implement password reset functionality
3. Add email verification
4. Implement rate limiting
5. Add refresh token blacklist
6. Implement wallet transaction APIs
7. Implement points management APIs

---

**Created:** November 26, 2025
**Author:** Auto-generated Documentation
**Version:** 1.0.0
