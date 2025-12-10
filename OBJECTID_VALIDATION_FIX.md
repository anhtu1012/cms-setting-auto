# ObjectId Validation Fix

## 🐛 Problem

**Error**: `BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer`

This error occurred when invalid `databaseId` values were passed to endpoints, causing the application to crash when trying to convert them to MongoDB ObjectId.

## 📍 Where It Happened

1. `GET /:databaseId/:collectionName` - Getting data from collection
2. `POST /:databaseId/:collectionName` - Creating data
3. `POST /:databaseId/:collectionName/bulk` - Bulk create
4. `PUT /:databaseId/:collectionName/replace-all` - Replace all
5. Tier limit checks in guards

## ✅ Solution

Added **ObjectId validation** before attempting to convert strings to ObjectId in all affected services and guards.

## 🔧 Files Fixed

### 1. `collection-schema.service.ts`

**Method**: `findByNamePublic()`

```typescript
// BEFORE
return this.collectionSchemaModel
  .findOne({
    name,
    databaseId: new Types.ObjectId(databaseId), // ❌ Could crash
  })
  .exec();

// AFTER
if (!Types.ObjectId.isValid(databaseId)) {
  throw new BadRequestException(
    `Invalid databaseId format: "${databaseId}". Must be a 24 character hex string.`,
  );
}
return this.collectionSchemaModel
  .findOne({
    name,
    databaseId: new Types.ObjectId(databaseId), // ✅ Safe
  })
  .exec();
```

### 2. `tier-limits.guard.ts`

**Methods**:

- `checkDataLimit()`
- `checkBulkDataLimit()`
- `checkReplaceAllLimit()`

Added validation at the start of each method:

```typescript
if (!Types.ObjectId.isValid(databaseId)) {
  throw new BadRequestException(
    `Invalid databaseId format: "${databaseId}". Must be a 24 character hex string.`,
  );
}
```

### 3. `tier.service.ts`

**Methods**:

- `canCreateData()`
- `getDataUsageByCollection()`

Added validation before database operations:

```typescript
if (!Types.ObjectId.isValid(databaseId)) {
  throw new BadRequestException(
    `Invalid databaseId format: "${databaseId}". Must be a 24 character hex string.`,
  );
}
```

### 4. NEW: `validation.utils.ts`

Created utility functions for reusable validation:

```typescript
// Simple validation
validateObjectId(id, 'databaseId');

// Multiple validations
validateObjectIds({
  databaseId: '...',
  userId: '...'
});

// Safe conversion
const objectId = toObjectId(id, 'databaseId');

// Check without throwing
if (isValidObjectId(id)) { ... }
```

## 📊 Impact

### Before

- ❌ Application crashes on invalid ObjectId
- ❌ No clear error message
- ❌ Difficult to debug

### After

- ✅ Graceful error handling
- ✅ Clear error message: `Invalid databaseId format: "abc123". Must be a 24 character hex string.`
- ✅ 400 Bad Request (instead of 500 Internal Server Error)

## 🧪 Testing

### Test Invalid ObjectId

```bash
# Invalid databaseId (too short)
curl http://localhost:3001/abc123/products
# Response: 400 Bad Request
# "Invalid databaseId format: \"abc123\". Must be a 24 character hex string."

# Invalid databaseId (not hex)
curl http://localhost:3001/xxxxxxxxxxxxxxxxxxxxxxxx/products
# Response: 400 Bad Request

# Valid databaseId (24 hex chars)
curl http://localhost:3001/507f1f77bcf86cd799439011/products
# Response: 200 OK or 404 (if not found)
```

### Test in Swagger

1. Open http://localhost:3001/api
2. Try GET `/:databaseId/:collectionName` with invalid ID
3. Should get clear 400 error (not 500)

## 🎯 Valid ObjectId Format

MongoDB ObjectId must be:

- **Exactly 24 characters**
- **Hexadecimal** (0-9, a-f, A-F)

Examples:

```
✅ Valid:
- 507f1f77bcf86cd799439011
- 5f8d0d55b54764421b7156d9
- 6475a8c3d2f1e4b3a9c8d7e6

❌ Invalid:
- abc123 (too short)
- 507f1f77bcf86cd799439011x (invalid char 'x')
- 507f-1f77-bcf8-6cd7-9943-9011 (has dashes)
- user123 (not hex)
```

## 🔍 Why This Happens

Common causes of invalid ObjectId:

1. **Frontend mistake**: Sending wrong ID format
2. **URL typo**: User manually editing URL
3. **Old/cached data**: Using old non-ObjectId format
4. **Testing**: Using test data like "test123"

## 🛡️ Prevention

### Frontend Best Practices

```typescript
// Validate before API call
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Use before making request
if (!isValidObjectId(databaseId)) {
  console.error('Invalid database ID');
  return;
}

// Make API call
await fetch(`/${databaseId}/products`);
```

### Backend (Now Implemented)

```typescript
// Always validate before using
validateObjectId(databaseId, 'databaseId');

// Or use safe conversion
const id = toObjectId(databaseId, 'databaseId');
```

## 📝 API Error Response

### Security Enhancement

Added **database ownership validation** to `/tier/data-usage/:databaseId` endpoint to prevent users from viewing usage statistics of databases they don't own.

```typescript
// Now checks if database belongs to user
const database = await this.databaseModel
  .findOne({
    _id: new Types.ObjectId(databaseId),
    userId: new Types.ObjectId(userId),
  })
  .exec();

if (!database) {
  throw new ForbiddenException(
    `Database not found or you don't have permission to access it`,
  );
}
```

### New Error Format

```json
{
  "statusCode": 400,
  "message": "Invalid databaseId format: \"abc123\". Must be a 24 character hex string.",
  "error": "Bad Request"
}
```

### Old Error (Before Fix)

```json
{
  "statusCode": 500,
  "message": "BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
  "error": "Internal Server Error"
}
```

## ✅ Checklist

- [x] Added validation to collection-schema.service.ts
- [x] Added validation to tier-limits.guard.ts (3 methods)
- [x] Added validation to tier.service.ts (2 methods)
- [x] Created validation.utils.ts with helper functions
- [x] Added Types import to all files
- [x] No compile errors
- [x] Tested with invalid IDs
- [x] Updated documentation

## 🚀 Deployment

No migration needed. This is a code-level fix.

### Deploy Steps

1. ✅ Test locally with invalid IDs
2. ✅ Verify error messages are clear
3. ✅ Deploy to staging
4. ✅ Test in staging
5. ✅ Deploy to production

## 📞 Support

If you encounter ObjectId errors:

1. Check the ID format (24 hex characters)
2. Verify the error message provides clear guidance
3. Use validation utilities for consistency

## 🔜 Future Improvements

- [ ] Add DTOs with validation decorators for automatic check
- [ ] Create custom @IsObjectId() decorator
- [ ] Add request logging for invalid IDs
- [ ] Create dashboard for common validation errors

## 📌 Related Files

- `src/common/utils/validation.utils.ts` - Validation helpers
- `src/common/guards/tier-limits.guard.ts` - Guard validations
- `src/common/tier/tier.service.ts` - Service validations
- `src/modules/dynamic-cms/controller/collection-schema/collection-schema.service.ts` - Schema service

---

**Fixed**: December 10, 2025
**Status**: ✅ Complete & Tested
**Impact**: High (prevents application crashes)
