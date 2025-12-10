#!/bin/bash

# Demo script để test Tier System
# Thay YOUR_TOKEN bằng JWT token thực của bạn

BASE_URL="http://localhost:3000"
TOKEN="YOUR_TOKEN"

echo "🎯 TIER SYSTEM DEMO"
echo "===================="
echo ""

# 1. Lấy thông tin tier
echo "1️⃣ Lấy thông tin tier hiện tại..."
curl -s -X GET "$BASE_URL/tier/info" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""
echo "---"
echo ""

# 2. Kiểm tra giới hạn database
echo "2️⃣ Kiểm tra giới hạn database..."
curl -s -X GET "$BASE_URL/tier/check-database-limit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""
echo "---"
echo ""

# 3. Tạo database (sẽ tự động check limit)
echo "3️⃣ Thử tạo database..."
curl -s -X POST "$BASE_URL/databases" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test-tier-db",
    "displayName": "Test Tier Database",
    "description": "Database để test tier system"
  }' | jq '.'
echo ""
echo "---"
echo ""

# 4. Lấy danh sách databases
echo "4️⃣ Lấy danh sách databases..."
curl -s -X GET "$BASE_URL/databases" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.data | length as $count | "Tổng số databases: \($count)"'
echo ""
echo "---"
echo ""

# 5. Kiểm tra giới hạn data (giả sử đã có databaseId)
# Thay DATABASE_ID bằng ID thực của database
DATABASE_ID="YOUR_DATABASE_ID"
COLLECTION="products"

echo "5️⃣ Kiểm tra giới hạn data cho collection '$COLLECTION'..."
curl -s -X GET "$BASE_URL/tier/check-data-limit/$DATABASE_ID/$COLLECTION" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""
echo "---"
echo ""

# 6. Lấy thống kê usage
echo "6️⃣ Lấy thống kê usage theo collection..."
curl -s -X GET "$BASE_URL/tier/data-usage/$DATABASE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""
echo "---"
echo ""

echo "✅ Demo hoàn thành!"
echo ""
echo "💡 Tips:"
echo "  - Nếu bạn đang dùng FREE tier (2 databases max)"
echo "  - Thử tạo database thứ 3 để xem error message"
echo "  - Tạo > 100 data trong 1 collection để test limit"
echo ""
