# 🚀 Quick Reference - CMS Setting Auto

## Migration Commands

```bash
# Main migration command
npm run migration:tier              # Seed tier configs (free, basic, premium, enterprise)

# Other migrations
npm run migration:run add-tier-to-users    # Add tier to existing users
npm run migration:run <name>               # Run any migration

# Using Makefile
make migration-tier                 # Seed tier configs
make migration-users                # Add tier to users
make migration-all                  # Run all migrations
```

## Development Commands

```bash
# Start server
npm run start:dev                   # Development mode with hot reload
npm run start                       # Normal mode
npm run start:prod                  # Production mode

# Build
npm run build                       # Build project
make build                          # Alternative with Makefile

# Test
npm run test                        # Run all tests
npm run test:watch                  # Watch mode
npm run test:cov                    # With coverage
```

## Tier Management API

```bash
# Get all tiers
GET http://localhost:3001/v1/tier-config

# Get specific tier
GET http://localhost:3001/v1/tier-config/premium

# Get tier limits only
GET http://localhost:3001/v1/tier-config/premium/limits

# Create new tier (Admin only - requires token)
POST http://localhost:3001/v1/tier-config
Authorization: Bearer <token>
{
  "tierCode": "pro",
  "tierName": "Pro",
  "maxDatabases": 10,
  "maxDataPerCollection": 5000,
  "maxCollectionsPerDatabase": 50,
  "maxStorageGB": 25,
  "maxApiCallsPerDay": 50000,
  "price": 29.99,
  "currency": "USD"
}

# Update tier
PUT http://localhost:3001/v1/tier-config/pro
Authorization: Bearer <token>
{
  "price": 39.99,
  "maxDatabases": 15
}

# Delete tier (soft delete)
DELETE http://localhost:3001/v1/tier-config/pro
Authorization: Bearer <token>

# Seed default tiers
POST http://localhost:3001/v1/tier-config/seed/defaults
Authorization: Bearer <token>
```

## User Tier Operations

```bash
# Get current user tier info
GET http://localhost:3001/v1/tier/info
Authorization: Bearer <token>

# Check if can create database
GET http://localhost:3001/v1/tier/check-database-limit
Authorization: Bearer <token>

# Check if can add data
GET http://localhost:3001/v1/tier/check-data-limit/:databaseId/:collectionName
Authorization: Bearer <token>

# Get usage statistics
GET http://localhost:3001/v1/tier/usage
Authorization: Bearer <token>

# Upgrade user tier
POST http://localhost:3001/v1/tier/upgrade
Authorization: Bearer <token>
{
  "userId": "user_id",
  "newTier": "premium",
  "reason": "Payment via Stripe"
}
```

## Database Operations

```bash
# Create database (tier limit checked)
POST http://localhost:3001/v1/databases
Authorization: Bearer <token>
{
  "name": "my-database",
  "description": "My database"
}

# List databases
GET http://localhost:3001/v1/databases
Authorization: Bearer <token>

# Get database
GET http://localhost:3001/v1/databases/:id
Authorization: Bearer <token>

# Update database
PUT http://localhost:3001/v1/databases/:id
Authorization: Bearer <token>

# Delete database
DELETE http://localhost:3001/v1/databases/:id
Authorization: Bearer <token>
```

## Data Operations (Collection)

```bash
# Create data (tier limit checked)
POST http://localhost:3001/v1/:databaseId/:collectionName
Authorization: Bearer <token>
{
  "field1": "value1",
  "field2": "value2"
}

# Bulk create
POST http://localhost:3001/v1/:databaseId/:collectionName/bulk
Authorization: Bearer <token>
[
  {"field1": "value1"},
  {"field1": "value2"}
]

# Replace all data
PUT http://localhost:3001/v1/:databaseId/:collectionName/replace-all
Authorization: Bearer <token>
[...]

# List data
GET http://localhost:3001/v1/:databaseId/:collectionName
Authorization: Bearer <token>

# Get single data
GET http://localhost:3001/v1/:databaseId/:collectionName/:id
Authorization: Bearer <token>

# Update data
PATCH http://localhost:3001/v1/:databaseId/:collectionName/:id
Authorization: Bearer <token>

# Delete data
DELETE http://localhost:3001/v1/:databaseId/:collectionName/:id
Authorization: Bearer <token>
```

## Authentication

```bash
# Register
POST http://localhost:3001/v1/auth/register
{
  "email": "user@example.com",
  "userName": "username",
  "password": "password",
  "firstName": "John",
  "lastName": "Doe"
}

# Login
POST http://localhost:3001/v1/auth/login
{
  "userName": "username",
  "password": "password"
}

# Refresh token
POST http://localhost:3001/v1/auth/refresh-token
{
  "refreshToken": "token"
}

# Logout
POST http://localhost:3001/v1/auth/logout
Authorization: Bearer <token>
```

## Default Tiers

```
FREE Tier:
- 2 databases
- 100 data per collection
- 5 collections per database
- 1 GB storage
- 1,000 API calls/day

BASIC Tier:
- 5 databases
- 1,000 data per collection
- 20 collections per database
- 5 GB storage
- 10,000 API calls/day

PREMIUM Tier:
- 20 databases
- 10,000 data per collection
- 100 collections per database
- 50 GB storage
- 100,000 API calls/day

ENTERPRISE Tier:
- Unlimited databases
- Unlimited data per collection
- Unlimited collections per database
- Unlimited storage
- Unlimited API calls/day
```

## Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/cms-setting-auto

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
```

## Useful Commands

```bash
# Database backup
mongodump --uri="mongodb://localhost:27017/cms-setting-auto" --out=./backup

# Database restore
mongorestore --uri="mongodb://localhost:27017/cms-setting-auto" --drop ./backup/cms-setting-auto

# Check MongoDB
mongosh
use cms-setting-auto
db.tierconfigs.find().pretty()
db.users.find().pretty()

# Check API health
curl http://localhost:3001/v1
```

## Troubleshooting

```bash
# Build errors
npm run build                # Check for TypeScript errors
npm install                  # Reinstall dependencies

# Migration errors
npm run build                # Build first
npm run migration:tier       # Then run migration

# Database connection errors
mongosh                      # Test MongoDB connection
# Check MONGODB_URI in .env

# Port already in use
# Change PORT in .env
# Or kill process: netstat -ano | findstr :3001
```

## Documentation Links

- [Migration Guide](./docs/MIGRATION_GUIDE.md)
- [Tier API Guide](./docs/API_TIER_CONFIG_GUIDE.md)
- [Tier Migration Guide](./TIER_MIGRATION_GUIDE.md)
- [Tier System Summary](./TIER_SYSTEM_SUMMARY.md)
- [Dynamic CMS Guide](./docs/DYNAMIC_CMS.md)

---

**Last Updated:** December 2024
