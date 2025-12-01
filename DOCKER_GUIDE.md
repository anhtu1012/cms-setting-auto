# 🐳 Hướng Dẫn Chi Tiết Docker - CMS Setting Auto

## 📋 Mục Lục

1. [Giới Thiệu](#giới-thiệu)
2. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
3. [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
4. [Khởi Chạy Nhanh](#khởi-chạy-nhanh)
5. [Chi Tiết Các File Docker](#chi-tiết-các-file-docker)
6. [Môi Trường Development](#môi-trường-development)
7. [Môi Trường Production](#môi-trường-production)
8. [Quản Lý Container](#quản-lý-container)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## 🎯 Giới Thiệu

Dự án CMS Setting Auto được đóng gói hoàn toàn bằng Docker, bao gồm:

- **NestJS Backend** - API server chính
- **MongoDB** - Database
- **Mongo Express** - Web UI để quản lý database

## 💻 Yêu Cầu Hệ Thống

### Windows:

- Docker Desktop 20.10+
- Docker Compose V2+
- RAM: Tối thiểu 4GB (Khuyến nghị 8GB)
- Disk: 10GB trống

### Cài Đặt Docker Desktop:

1. Tải Docker Desktop: https://www.docker.com/products/docker-desktop
2. Cài đặt và khởi động Docker Desktop
3. Kiểm tra cài đặt:

```bash
docker --version
docker-compose --version
```

## 📁 Cấu Trúc Dự Án

```
cms-setting-auto-be/
├── Dockerfile                 # Multi-stage build file
├── .dockerignore             # Loại trừ file không cần thiết
├── docker-compose.yml        # Production setup
├── docker-compose.dev.yml    # Development setup với hot-reload
└── src/                      # Source code
```

---

## 🚀 Khởi Chạy Nhanh

### Bước 1: Clone Project

```bash
cd d:\1ACODER\cms-setting-auto\cms-setting-auto-be
```

### Bước 2: Khởi Động Services (Production)

```bash
docker-compose up -d
```

### Bước 3: Kiểm Tra Trạng Thái

```bash
docker-compose ps
```

### Bước 4: Truy Cập Ứng Dụng

- **Backend API**: http://localhost:3000
- **Swagger API Docs**: http://localhost:3000/api
- **MongoDB**: localhost:27017
- **Mongo Express**: http://localhost:8081

### Bước 5: Xem Logs

```bash
docker-compose logs -f backend
```

### Bước 6: Dừng Services

```bash
docker-compose down
```

---

## 📝 Chi Tiết Các File Docker

### 1. Dockerfile (Multi-Stage Build)

Dockerfile được chia thành 4 stages:

#### **Stage 1: Base**

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
```

- Tạo base image với Node.js 20 Alpine (nhẹ nhất)
- Copy package files để tận dụng Docker cache

#### **Stage 2: Development**

```dockerfile
FROM base AS development
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
```

- Cài đặt tất cả dependencies (bao gồm devDependencies)
- Hỗ trợ hot-reload cho development

#### **Stage 3: Build**

```dockerfile
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build
```

- Cài đặt dependencies và build production code
- Tạo thư mục `dist/` với compiled code

#### **Stage 4: Production**

```dockerfile
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=build /app/dist ./dist
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app
USER nestjs
EXPOSE 3000
CMD ["node", "dist/src/main"]
```

- Image nhẹ nhất, chỉ production dependencies
- Chạy với non-root user (bảo mật)
- Tối ưu cho deployment

### 2. .dockerignore

Loại trừ các file không cần thiết khỏi Docker build:

```
node_modules
dist
.env
.git
README.md
test
coverage
```

### 3. docker-compose.yml (Production)

```yaml
services:
  mongodb:
    image: mongo:7
    container_name: cms-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
    volumes:
      - mongodb_data:/data/db
    networks:
      - cms-network

  backend:
    build:
      context: .
      target: production
    container_name: cms-backend
    environment:
      MONGODB_URI: mongodb://admin:admin123@mongodb:27017/cms-setting-auto?authSource=admin
      JWT_SECRET: your-secret-key-change-in-production
    depends_on:
      - mongodb
    networks:
      - cms-network

  mongo-express:
    image: mongo-express:latest
    ports:
      - '8081:8081'
    depends_on:
      - mongodb
```

---

## 🔧 Môi Trường Development

### Option 1: Sử dụng docker-compose.dev.yml

```bash
# Khởi động với hot-reload
docker-compose -f docker-compose.dev.yml up -d

# Xem logs real-time
docker-compose -f docker-compose.dev.yml logs -f backend

# Dừng
docker-compose -f docker-compose.dev.yml down
```

**Ưu điểm:**

- ✅ Hot-reload tự động khi code thay đổi
- ✅ Volume mount để sync code
- ✅ Không cần rebuild khi sửa code

### Option 2: Local Development (Không dùng Docker cho Backend)

```bash
# Chỉ chạy MongoDB
docker-compose up -d mongodb

# Chạy backend local
npm run start:dev
```

### So Sánh Development Options

| Feature            | docker-compose.dev.yml | Local + Docker DB |
| ------------------ | ---------------------- | ----------------- |
| Hot-reload         | ✅                     | ✅                |
| Debugging          | ⚠️ Khó hơn             | ✅ Dễ dàng        |
| Environment parity | ✅ Giống production    | ⚠️ Khác biệt      |
| Setup time         | Nhanh                  | Cần cài Node.js   |

---

## 🏭 Môi Trường Production

### Deploy Bằng Docker Compose

```bash
# Build image
docker-compose build --no-cache

# Khởi động
docker-compose up -d

# Kiểm tra health
docker-compose ps
docker-compose logs backend
```

### Deploy Bằng Docker Image Riêng

```bash
# Build production image
docker build -t cms-backend:v1.0.0 --target production .

# Push to registry (optional)
docker tag cms-backend:v1.0.0 your-registry.com/cms-backend:v1.0.0
docker push your-registry.com/cms-backend:v1.0.0

# Run container
docker run -d \
  --name cms-backend \
  -p 3000:3000 \
  -e MONGODB_URI="mongodb://admin:admin123@mongodb:27017/cms-setting-auto?authSource=admin" \
  -e JWT_SECRET="super-secret-key" \
  -e NODE_ENV="production" \
  --network cms-network \
  cms-backend:v1.0.0
```

### Environment Variables cho Production

Tạo file `.env.production`:

```env
# Application
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb://admin:strong-password-here@mongodb:27017/cms-setting-auto?authSource=admin

# Security
JWT_SECRET=generate-strong-random-secret-key-here
JWT_EXPIRES_IN=7d

# Optional
LOG_LEVEL=info
```

**⚠️ QUAN TRỌNG:**

- ❌ KHÔNG commit file `.env` lên Git
- ✅ Sử dụng Docker secrets hoặc Kubernetes secrets
- ✅ Rotate JWT_SECRET định kỳ
- ✅ Sử dụng strong password cho MongoDB

---

## 🎛️ Quản Lý Container

### Xem Logs

```bash
# Logs tất cả services
docker-compose logs

# Logs một service cụ thể
docker-compose logs backend
docker-compose logs mongodb

# Follow logs real-time
docker-compose logs -f backend

# Logs với timestamp
docker-compose logs -t backend

# Lấy 100 dòng log cuối
docker-compose logs --tail=100 backend
```

### Kiểm Tra Trạng Thái

```bash
# Xem container đang chạy
docker-compose ps

# Chi tiết một service
docker inspect cms-backend

# Xem resource usage
docker stats cms-backend
```

### Restart Services

```bash
# Restart tất cả
docker-compose restart

# Restart một service
docker-compose restart backend

# Restart với rebuild
docker-compose up -d --build backend
```

### Dọn Dẹp

```bash
# Dừng và xóa containers
docker-compose down

# Xóa cả volumes (XÓA DATA!)
docker-compose down -v

# Xóa images không dùng
docker image prune -a

# Xóa tất cả (containers, networks, volumes)
docker system prune -a --volumes
```

### Access Container Shell

```bash
# Backend shell
docker-compose exec backend sh

# MongoDB shell
docker-compose exec mongodb mongosh -u admin -p admin123

# Hoặc dùng bash nếu có
docker-compose exec backend /bin/bash
```

### Debug Inside Container

```bash
# Kiểm tra file structure
docker-compose exec backend ls -la /app/dist/

# Xem environment variables
docker-compose exec backend env

# Check network connectivity
docker-compose exec backend ping mongodb

# Test MongoDB connection
docker-compose exec backend node -e "console.log(process.env.MONGODB_URI)"
```

---

## 🐛 Troubleshooting

### Lỗi: Cannot find module '/app/dist/main'

**Nguyên nhân:** File main.js ở sai vị trí

**Giải pháp:**

```bash
# Kiểm tra cấu trúc dist
docker run --rm --entrypoint sh cms-backend:latest -c "find /app/dist -name '*.js'"

# Nếu file ở dist/src/main.js, sửa CMD trong Dockerfile:
CMD ["node", "dist/src/main"]
```

### Lỗi: sh: nest: not found

**Nguyên nhân:** Build stage thiếu devDependencies

**Giải pháp:** Đảm bảo build stage dùng `npm ci` (không có --only=production)

### Lỗi: Docker daemon not running

**Giải pháp:**

1. Mở Docker Desktop
2. Chờ Docker khởi động hoàn toàn
3. Kiểm tra: `docker ps`

### Container Restart Liên Tục

```bash
# Xem logs để biết lỗi
docker-compose logs --tail=50 backend

# Các lỗi phổ biến:
# - MongoDB connection failed -> Check MONGODB_URI
# - Port already in use -> Change port hoặc kill process
# - Missing environment variables -> Check .env file
```

### Port Already in Use

```bash
# Windows: Tìm process dùng port 3000
netstat -ano | findstr :3000

# Kill process bằng PID
taskkill /PID <PID> /F

# Hoặc đổi port trong docker-compose.yml
ports:
  - "3001:3000"
```

### MongoDB Connection Issues

```bash
# Test connection từ backend
docker-compose exec backend ping mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Test với mongosh
docker-compose exec mongodb mongosh -u admin -p admin123

# Verify connection string
# Trong Docker network dùng: mongodb://admin:admin123@mongodb:27017
# Từ host dùng: mongodb://admin:admin123@localhost:27017
```

### Image Build Lỗi

```bash
# Clean build cache
docker builder prune

# Build lại không cache
docker-compose build --no-cache backend

# Xem chi tiết build
docker-compose build --progress=plain backend
```

### Volume Permission Issues

```bash
# Linux/Mac: Sửa permissions
docker-compose exec backend chown -R nestjs:nodejs /app

# Windows: Thường không gặp vấn đề này
```

---

## ✨ Best Practices

### 1. Security

#### Không Hardcode Secrets

```yaml
# ❌ BAD
environment:
  JWT_SECRET: "my-secret-123"

# ✅ GOOD
environment:
  JWT_SECRET: ${JWT_SECRET}
```

#### Sử Dụng Non-Root User

```dockerfile
# ✅ GOOD - Dockerfile đã implement
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001
USER nestjs
```

#### Scan Image Security

```bash
# Sử dụng Docker Scout hoặc Trivy
docker scout cve cms-backend:latest
```

### 2. Performance

#### Multi-Stage Build

- ✅ Giảm kích thước image (từ ~1GB xuống ~150MB)
- ✅ Tách biệt build dependencies và runtime
- ✅ Faster deployment

#### Layer Caching

```dockerfile
# ✅ GOOD - Copy package.json trước
COPY package*.json ./
RUN npm ci
COPY . .

# ❌ BAD - Copy all rồi mới install
COPY . .
RUN npm ci
```

#### Slim Base Image

```dockerfile
# ✅ GOOD - Alpine Linux
FROM node:20-alpine

# ❌ BAD - Full image (lớn hơn 3-4 lần)
FROM node:20
```

### 3. Development Workflow

#### Hot Reload với Volume Mount

```yaml
# docker-compose.dev.yml
volumes:
  - .:/app
  - /app/node_modules # Prevent overwrite
```

#### Logging Best Practices

```bash
# Structured logging
docker-compose logs --timestamps --tail=1000 backend > logs.txt

# Log rotation (production)
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### 4. CI/CD Integration

```yaml
# .github/workflows/docker.yml
name: Docker Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker Image
        run: |
          docker build -t cms-backend:${{ github.sha }} .

      - name: Run Tests
        run: |
          docker-compose run backend npm test
```

### 5. Monitoring

```bash
# Resource monitoring
docker stats --no-stream

# Health checks trong docker-compose.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

---

## 📊 Useful Commands Reference

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Watch logs
docker-compose -f docker-compose.dev.yml logs -f

# Rebuild after dependency changes
docker-compose -f docker-compose.dev.yml up -d --build

# Stop
docker-compose -f docker-compose.dev.yml down
```

### Production

```bash
# Build production image
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend

# Restart service
docker-compose restart backend

# Stop all
docker-compose down

# Update and restart
docker-compose up -d --build
```

### Database Management

```bash
# Backup MongoDB
docker-compose exec mongodb mongodump -u admin -p admin123 --authenticationDatabase admin -o /dump

# Restore MongoDB
docker-compose exec mongodb mongorestore -u admin -p admin123 --authenticationDatabase admin /dump

# Export data
docker exec cms-mongodb mongoexport -u admin -p admin123 --authenticationDatabase admin -d cms-setting-auto -c users -o /users.json

# Drop database (DANGER!)
docker-compose exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin --eval "db.dropDatabase()"
```

### Maintenance

```bash
# View disk usage
docker system df

# Clean unused resources
docker system prune -a

# Remove specific image
docker rmi cms-backend:latest

# View image layers
docker history cms-backend:latest

# Inspect image
docker inspect cms-backend:latest

# Export/Import images
docker save cms-backend:latest -o cms-backend.tar
docker load -i cms-backend.tar
```

---

## 🎓 Learning Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Docker Best Practices](https://docs.nestjs.com/recipes/docker)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

## 📞 Support

Nếu gặp vấn đề:

1. Kiểm tra [Troubleshooting](#troubleshooting) section
2. Xem logs: `docker-compose logs -f`
3. Check GitHub Issues
4. Contact team

---

**Happy Dockerizing! 🐳**
