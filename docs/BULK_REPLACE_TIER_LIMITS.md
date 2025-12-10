# Tier Limits for Bulk and Replace-All Operations

## Overview

Tier limits are now enforced for bulk operations and replace-all operations to prevent users from exceeding their tier limits.

## Affected Endpoints

### 1. POST /:databaseId/:collectionName/bulk

**Bulk Create Multiple Documents**

#### Limit Check Logic:

```typescript
Current Count + New Items Count ≤ Max Limit
```

#### Example:

```bash
# User has FREE tier (limit: 100 data/collection)
# Current data count: 85

# Attempt to create 10 items via bulk
curl -X POST http://localhost:3000/{dbId}/products/bulk \
  -H "Authorization: Bearer TOKEN" \
  -d '[
    {"name": "Item 1", "price": 100},
    {"name": "Item 2", "price": 200},
    ...10 items...
  ]'

# Result:
# 85 + 10 = 95 ≤ 100 ✅ ALLOWED

# Attempt to create 20 items via bulk
# 85 + 20 = 105 > 100 ❌ BLOCKED
# Error: "Cannot create 20 items. Current: 85, Limit: 100..."
```

### 2. PUT /:databaseId/:collectionName/replace-all

**Replace All Documents in Collection**

#### Limit Check Logic:

```typescript
New Items Count ≤ Max Limit
```

Note: Replace-all deletes all existing data first, then creates new data. So we only check if the new data count exceeds the limit.

#### Example:

```bash
# User has FREE tier (limit: 100 data/collection)
# Current data count: 150 (somehow got in before tier system)

# Attempt to replace with 80 items
curl -X PUT http://localhost:3000/{dbId}/products/replace-all \
  -H "Authorization: Bearer TOKEN" \
  -d '[
    {"name": "New Item 1", "price": 100},
    {"name": "New Item 2", "price": 200},
    ...80 items...
  ]'

# Result:
# 80 ≤ 100 ✅ ALLOWED
# All 150 old items deleted, 80 new items created

# Attempt to replace with 120 items
# 120 > 100 ❌ BLOCKED
# Error: "Cannot replace with 120 items. Maximum data per collection is 100..."
```

## Error Messages

### Bulk Create - Exceeds Limit

```json
{
  "statusCode": 403,
  "message": "Cannot create 30 items. Current: 85, Limit: 100 for your free tier. You can add maximum 15 more items."
}
```

### Replace-All - Exceeds Limit

```json
{
  "statusCode": 403,
  "message": "Cannot replace with 120 items. Maximum data per collection is 100 for your free tier."
}
```

## Tier Limits Summary

| Tier       | Max Data/Collection |
| ---------- | ------------------- |
| FREE       | 100                 |
| BASIC      | 1,000               |
| PREMIUM    | 10,000              |
| ENTERPRISE | Unlimited           |

## Implementation Details

### Guard: TierLimitsGuard

The guard automatically detects the operation type and applies the appropriate limit check:

```typescript
// Detect operation type
if (isBulkCreation()) {
  checkBulkDataLimit(); // Current + New ≤ Limit
} else if (isReplaceAll()) {
  checkReplaceAllLimit(); // New ≤ Limit
}
```

### Applied to Controllers

```typescript
@Post('bulk')
@UseGuards(TierLimitsGuard) // ← Automatic check
async createMany() { ... }

@Put('replace-all')
@UseGuards(TierLimitsGuard) // ← Automatic check
async replaceAll() { ... }
```

## Testing Scenarios

### Scenario 1: Bulk Create Within Limit

```bash
# Setup: 70 items in collection, FREE tier (limit: 100)
# Action: Bulk create 20 items
# Expected: ✅ Success (70 + 20 = 90 ≤ 100)
```

### Scenario 2: Bulk Create Exceeds Limit

```bash
# Setup: 95 items in collection, FREE tier (limit: 100)
# Action: Bulk create 10 items
# Expected: ❌ Blocked (95 + 10 = 105 > 100)
```

### Scenario 3: Replace-All Within Limit

```bash
# Setup: 200 items in collection, FREE tier (limit: 100)
# Action: Replace with 80 items
# Expected: ✅ Success (80 ≤ 100)
```

### Scenario 4: Replace-All Exceeds Limit

```bash
# Setup: 50 items in collection, FREE tier (limit: 100)
# Action: Replace with 150 items
# Expected: ❌ Blocked (150 > 100)
```

### Scenario 5: ENTERPRISE Tier (Unlimited)

```bash
# Setup: ENTERPRISE tier
# Action: Bulk create 10,000 items
# Expected: ✅ Success (no limit)

# Action: Replace with 50,000 items
# Expected: ✅ Success (no limit)
```

## Frontend Integration

### Check Before Bulk Create

```typescript
async function bulkCreateItems(items: any[]) {
  // Check current limit
  const limitCheck = await fetch(
    `/tier/check-data-limit/${dbId}/${collection}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const result = await limitCheck.json();

  if (!result.allowed || result.limit - result.current < items.length) {
    showError(`You can only add ${result.limit - result.current} more items`);
    return;
  }

  // Proceed with bulk create
  await fetch(`/${dbId}/${collection}/bulk`, {
    method: 'POST',
    body: JSON.stringify(items),
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

### Check Before Replace-All

```typescript
async function replaceAllItems(items: any[]) {
  const tierInfo = await fetch('/tier/info', {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

  const limit = tierInfo.limits.maxDataPerCollection;

  if (limit !== -1 && items.length > limit) {
    showError(
      `Cannot replace with ${items.length} items. Your limit is ${limit}`,
    );
    return;
  }

  // Proceed with replace-all
  await fetch(`/${dbId}/${collection}/replace-all`, {
    method: 'PUT',
    body: JSON.stringify(items),
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

## Best Practices

1. **Check limits before operations**: Use tier info API to check limits before attempting bulk operations
2. **Show clear messages**: Display remaining capacity to users
3. **Chunk large operations**: For very large datasets, split into multiple bulk operations
4. **Handle errors gracefully**: Show upgrade options when limits are reached
5. **Monitor usage**: Track usage patterns to recommend tier upgrades

## API Rate Consideration

While tier limits control the **total number** of data items, consider implementing rate limiting for **API calls** to prevent abuse:

```typescript
// Future enhancement
if (userTier === 'FREE' && apiCallsToday > 1000) {
  throw new ForbiddenException('API rate limit exceeded');
}
```

## Migration Notes

Existing data above tier limits is not automatically deleted. However:

- Users cannot add more data until they either delete data or upgrade
- Replace-all operation can be used to reduce data to within limits

## Support

For questions about tier limits on bulk/replace-all operations, refer to:

- [TIER_SYSTEM_GUIDE.md](TIER_SYSTEM_GUIDE.md)
- [TIER_README.md](TIER_README.md)

## Changelog

- **2025-12-10**: Added tier limit checks for bulk and replace-all operations
