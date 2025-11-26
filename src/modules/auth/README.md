# Authentication Module

## Cấu trúc rõ ràng của Auth Module

```
auth/
├── dto/                          # Data Transfer Objects
│   ├── auth-request.dto.ts      # Request DTOs (Login, Register, RefreshToken)
│   └── auth-response.dto.ts     # Response DTOs (Login, Register, RefreshToken)
├── handlers/                     # Business Logic Handlers
│   ├── login.handler.ts         # Xử lý logic đăng nhập
│   ├── register.handler.ts      # Xử lý logic đăng ký
│   └── refresh-token.handler.ts # Xử lý logic refresh token
├── strategies/                   # Passport Strategies
│   └── jwt.strategy.ts          # JWT authentication strategy
├── guards/                       # Authentication Guards
│   └── jwt-auth.guard.ts        # JWT guard để bảo vệ routes
├── auth.controller.ts           # API Endpoints
├── auth.service.ts              # Service layer (gọi handlers)
└── auth.module.ts               # Module definition
```

## API Endpoints

### 1. Register (Đăng ký)

**POST** `/auth/register`

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

### 2. Login (Đăng nhập)

**POST** `/auth/login`

**Request Body:**

```json
{
  "emailOrUsername": "user@example.com",
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
    "avatar": null,
    "points": 100,
    "walletBalance": 500.5,
    "lastLogin": "2023-12-01T10:30:00Z"
  },
  "expiresIn": 3600
}
```

### 3. Refresh Token (Làm mới token)

**POST** `/auth/refresh-token`

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

## Sử dụng JWT Guard để bảo vệ routes

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('protected')
export class ProtectedController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile() {
    return { message: 'This is a protected route' };
  }
}
```

## Thông tin User mới

User schema đã được cập nhật với các trường:

- `userName`: Tên đăng nhập duy nhất
- `points`: Điểm tích lũy của user
- `walletBalance`: Số dư ví
- `walletTransactions`: Lịch sử giao dịch ví
- `pointsHistory`: Lịch sử điểm

## Environment Variables

Thêm vào file `.env`:

```
JWT_SECRET=your-secret-key-change-this-in-production
```

## Kiến trúc của mỗi API

Mỗi API endpoint tuân theo flow:

1. **Controller** - Nhận request từ client
2. **Service** - Điều phối và gọi handler
3. **Handler** - Xử lý business logic
4. **Response DTO** - Format response trả về client

Ví dụ flow của Login API:

```
Client Request → AuthController.login()
              → AuthService.login()
              → LoginHandler.execute()
              → Response DTO
```

## Testing

```bash
# Start development server
npm run start:dev

# Test với Swagger UI
http://localhost:3000/api
```
