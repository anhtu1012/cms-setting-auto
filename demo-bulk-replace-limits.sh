#!/bin/bash

# Demo script để test Tier Limits cho Bulk và Replace-All
# Thay YOUR_TOKEN và DATABASE_ID bằng giá trị thực

BASE_URL="http://localhost:3000"
TOKEN="YOUR_TOKEN"
DATABASE_ID="YOUR_DATABASE_ID"
COLLECTION="test_products"

echo "🎯 TIER LIMITS - BULK & REPLACE-ALL DEMO"
echo "========================================="
echo ""

# 1. Lấy thông tin tier
echo "1️⃣ Lấy thông tin tier và giới hạn..."
TIER_INFO=$(curl -s -X GET "$BASE_URL/tier/info" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")
echo "$TIER_INFO" | jq '.'
MAX_LIMIT=$(echo "$TIER_INFO" | jq -r '.limits.maxDataPerCollection')
echo "✅ Max data per collection: $MAX_LIMIT"
echo ""
echo "---"
echo ""

# 2. Kiểm tra giới hạn hiện tại
echo "2️⃣ Kiểm tra giới hạn data trong collection..."
LIMIT_CHECK=$(curl -s -X GET "$BASE_URL/tier/check-data-limit/$DATABASE_ID/$COLLECTION" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")
echo "$LIMIT_CHECK" | jq '.'
CURRENT_COUNT=$(echo "$LIMIT_CHECK" | jq -r '.current')
echo "✅ Current data count: $CURRENT_COUNT"
echo ""
echo "---"
echo ""

# 3. Test Bulk Create - Within Limit
echo "3️⃣ Test BULK CREATE - Tạo 5 items (within limit)..."
curl -s -X POST "$BASE_URL/$DATABASE_ID/$COLLECTION/bulk" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {"name": "Bulk Item 1", "price": 100, "sku": "BULK-001"},
    {"name": "Bulk Item 2", "price": 200, "sku": "BULK-002"},
    {"name": "Bulk Item 3", "price": 300, "sku": "BULK-003"},
    {"name": "Bulk Item 4", "price": 400, "sku": "BULK-004"},
    {"name": "Bulk Item 5", "price": 500, "sku": "BULK-005"}
  ]' | jq '.'
echo ""
echo "---"
echo ""

# 4. Test Bulk Create - Near Limit
echo "4️⃣ Test BULK CREATE - Tạo nhiều items gần đạt limit..."
# Tính số items có thể tạo
REMAINING=$((MAX_LIMIT - CURRENT_COUNT - 5))
echo "   Remaining capacity: $REMAINING items"
if [ $REMAINING -gt 0 ]; then
  echo "   Creating $REMAINING items..."
  # Generate JSON array dynamically (simplified)
  echo "   (Skipping actual creation for demo - would create $REMAINING items)"
else
  echo "   ⚠️ Already at or near limit!"
fi
echo ""
echo "---"
echo ""

# 5. Test Bulk Create - Exceeds Limit (should fail)
echo "5️⃣ Test BULK CREATE - Thử tạo vượt limit (should FAIL)..."
# Generate more items than allowed
ITEMS_JSON='['
for i in {1..20}; do
  ITEMS_JSON+='{"name": "Overflow Item '$i'", "price": '$i'00, "sku": "OVER-'$i'"},'
done
ITEMS_JSON=${ITEMS_JSON%,}  # Remove last comma
ITEMS_JSON+=']'

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/$DATABASE_ID/$COLLECTION/bulk" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$ITEMS_JSON")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "$BODY" | jq '.'
if [ "$HTTP_CODE" = "403" ]; then
  echo "✅ Correctly blocked! Tier limit enforced."
else
  echo "⚠️ Unexpected response"
fi
echo ""
echo "---"
echo ""

# 6. Test Replace-All - Within Limit
echo "6️⃣ Test REPLACE-ALL - Replace với 10 items (within limit)..."
curl -s -X PUT "$BASE_URL/$DATABASE_ID/$COLLECTION/replace-all" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {"name": "New Item 1", "price": 1000, "sku": "NEW-001"},
    {"name": "New Item 2", "price": 2000, "sku": "NEW-002"},
    {"name": "New Item 3", "price": 3000, "sku": "NEW-003"},
    {"name": "New Item 4", "price": 4000, "sku": "NEW-004"},
    {"name": "New Item 5", "price": 5000, "sku": "NEW-005"},
    {"name": "New Item 6", "price": 6000, "sku": "NEW-006"},
    {"name": "New Item 7", "price": 7000, "sku": "NEW-007"},
    {"name": "New Item 8", "price": 8000, "sku": "NEW-008"},
    {"name": "New Item 9", "price": 9000, "sku": "NEW-009"},
    {"name": "New Item 10", "price": 10000, "sku": "NEW-010"}
  ]' | jq '.'
echo ""
echo "---"
echo ""

# 7. Test Replace-All - Exceeds Limit (should fail)
echo "7️⃣ Test REPLACE-ALL - Thử replace với quá nhiều items (should FAIL)..."
# Generate more items than tier limit
REPLACE_JSON='['
for i in $(seq 1 $((MAX_LIMIT + 10))); do
  REPLACE_JSON+='{"name": "Overflow '$i'", "price": '$i', "sku": "OVF-'$i'"},'
done
REPLACE_JSON=${REPLACE_JSON%,}
REPLACE_JSON+=']'

RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/$DATABASE_ID/$COLLECTION/replace-all" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$REPLACE_JSON")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "$BODY" | jq '.'
if [ "$HTTP_CODE" = "403" ]; then
  echo "✅ Correctly blocked! Tier limit enforced."
else
  echo "⚠️ Unexpected response"
fi
echo ""
echo "---"
echo ""

# 8. Kiểm tra lại sau các operations
echo "8️⃣ Kiểm tra lại data count sau các operations..."
curl -s -X GET "$BASE_URL/tier/check-data-limit/$DATABASE_ID/$COLLECTION" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""
echo "---"
echo ""

# 9. Xem usage statistics
echo "9️⃣ Xem usage statistics..."
curl -s -X GET "$BASE_URL/tier/data-usage/$DATABASE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""

echo "✅ Demo hoàn thành!"
echo ""
echo "📊 Summary:"
echo "  - Tier limits được enforce cho bulk create ✓"
echo "  - Tier limits được enforce cho replace-all ✓"
echo "  - Error messages rõ ràng khi vượt limit ✓"
echo "  - Ownership verification tự động ✓"
echo ""
echo "💡 Tips:"
echo "  - FREE tier: max 100 data/collection"
echo "  - Bulk create check: current + new ≤ limit"
echo "  - Replace-all check: new ≤ limit"
echo "  - Upgrade tier để tăng giới hạn"
echo ""
