# Tier System Architecture Diagram

## 1. Tier Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                    Account Tiers                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  FREE          BASIC         PREMIUM      ENTERPRISE   │
│  ────          ─────         ───────      ──────────   │
│  2 DBs         5 DBs         20 DBs       Unlimited    │
│  100 data      1K data       10K data     Unlimited    │
│  5 cols        20 cols       100 cols     Unlimited    │
│  1GB           5GB           50GB         Unlimited    │
│  1K API/day    10K API/day   100K API/day Unlimited    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 2. System Flow - Create Database

```
┌──────────┐      ┌─────────────┐      ┌──────────────┐
│  Client  │─────▶│   POST      │─────▶│ JwtAuthGuard │
│          │      │ /databases  │      │   ✓ Token    │
└──────────┘      └─────────────┘      └──────┬───────┘
                                              │
                                              ▼
                                    ┌──────────────────┐
                                    │ TierLimitsGuard  │
                                    ├──────────────────┤
                                    │ 1. Get User      │
                                    │ 2. Get Tier      │
                                    │ 3. Count DBs     │
                                    │ 4. Check Limit   │
                                    └────┬─────────────┘
                                         │
                        ┌────────────────┼────────────────┐
                        │                                 │
                    Allowed                           Denied
                        │                                 │
                        ▼                                 ▼
              ┌──────────────────┐           ┌──────────────────┐
              │ DatabaseService  │           │  403 Forbidden   │
              │  .create()       │           │  Error Message   │
              └──────────────────┘           └──────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │   201 Created    │
              │   New Database   │
              └──────────────────┘
```

## 3. System Flow - Create Data

```
┌──────────┐      ┌───────────────────────┐      ┌──────────────┐
│  Client  │─────▶│   POST                │─────▶│ JwtAuthGuard │
│          │      │ /:dbId/:collection    │      │   ✓ Token    │
└──────────┘      └───────────────────────┘      └──────┬───────┘
                                                         │
                                                         ▼
                                              ┌──────────────────┐
                                              │ TierLimitsGuard  │
                                              ├──────────────────┤
                                              │ 1. Get User      │
                                              │ 2. Verify DB     │
                                              │ 3. Count Data    │
                                              │ 4. Check Limit   │
                                              └────┬─────────────┘
                                                   │
                                  ┌────────────────┼────────────────┐
                                  │                                 │
                              Allowed                           Denied
                                  │                                 │
                                  ▼                                 ▼
                        ┌──────────────────┐           ┌──────────────────┐
                        │ DynamicDataSvc   │           │  403 Forbidden   │
                        │  .create()       │           │  "Max 100 data"  │
                        └──────────────────┘           └──────────────────┘
                                  │
                                  ▼
                        ┌──────────────────┐
                        │   201 Created    │
                        │   New Data Item  │
                        └──────────────────┘
```

## 4. Data Model - User Schema

```
┌─────────────────────────────────────────────┐
│              User Collection                │
├─────────────────────────────────────────────┤
│                                             │
│  _id: ObjectId                              │
│  email: string                              │
│  userName: string                           │
│  password: string (hashed)                  │
│  ─────────────────────────────────────────  │
│  tier: "free" | "basic" | "premium" | ...   │◄──── NEW
│  tierStartDate: Date                        │◄──── NEW
│  tierExpiryDate: Date                       │◄──── NEW
│  tierHistory: Array<TierChange>             │◄──── NEW
│  ─────────────────────────────────────────  │
│  currentDatabaseCount: number               │◄──── NEW
│  apiCallsToday: number                      │◄──── NEW
│  lastApiCallReset: Date                     │◄──── NEW
│  ─────────────────────────────────────────  │
│  points: number                             │
│  walletBalance: number                      │
│  ...                                        │
│                                             │
└─────────────────────────────────────────────┘
```

## 5. Component Architecture

```
┌───────────────────────────────────────────────────────┐
│                    App Module                         │
├───────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  AuthModule  │  │ UsersModule  │  │ TierModule │ │◄── NEW
│  └──────────────┘  └──────────────┘  └────────────┘ │
│                                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │         DynamicCmsModule                     │   │
│  ├──────────────────────────────────────────────┤   │
│  │  • DatabaseController + Service              │   │
│  │  • CollectionSchemaController + Service      │   │
│  │  • DynamicDataController + Service           │   │
│  │  • TierLimitsGuard ◄────────────────────────┼───┼── INTEGRATED
│  └──────────────────────────────────────────────┘   │
│                                                       │
└───────────────────────────────────────────────────────┘
```

## 6. API Endpoints Map

```
Authentication
├── POST   /auth/login
├── POST   /auth/register
└── POST   /auth/refresh

Databases (protected + tier check)
├── POST   /databases              ◄─── TierLimitsGuard
├── GET    /databases
├── GET    /databases/:id
├── PUT    /databases/:id
└── DELETE /databases/:id

Dynamic Data (protected + tier check)
├── POST   /:dbId/:collection      ◄─── TierLimitsGuard
├── GET    /:dbId/:collection
├── GET    /:dbId/:collection/:id
├── PUT    /:dbId/:collection/:id
└── DELETE /:dbId/:collection/:id

Tier Management (NEW)
├── GET    /tier/info
├── GET    /tier/check-database-limit
├── GET    /tier/check-data-limit/:dbId/:collection
├── GET    /tier/data-usage/:dbId
└── POST   /tier/upgrade
```

## 7. Guard Decision Tree

```
                    ┌────────────────┐
                    │  HTTP Request  │
                    └────────┬───────┘
                             │
                    ┌────────▼─────────┐
                    │  JwtAuthGuard    │
                    │  Check Token     │
                    └────────┬─────────┘
                             │
                    ┌────────▼──────────┐
                    │ TierLimitsGuard   │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │ Is POST request?  │
                    └────┬──────────┬───┘
                         │          │
                        YES         NO
                         │          │
            ┌────────────▼─┐        └──────▶ ALLOW
            │              │
       /databases?    /:dbId/:col?
            │              │
            │              │
    ┌───────▼────┐   ┌────▼─────────┐
    │Check DB    │   │Check Data    │
    │Limit       │   │Limit         │
    └───┬────┬───┘   └───┬────┬─────┘
        │    │           │    │
      < MAX  >= MAX    < MAX  >= MAX
        │    │           │    │
     ALLOW  DENY      ALLOW  DENY
        │    │           │    │
        │    └───┐   ┌───┘    │
        │        │   │        │
        ▼        ▼   ▼        ▼
     Success   403  Success  403
```

## 8. Database Relationships

```
┌──────────┐          ┌──────────┐          ┌──────────────┐
│   User   │          │ Database │          │ DynamicData  │
├──────────┤          ├──────────┤          ├──────────────┤
│ _id      │◄────┐    │ _id      │◄────┐    │ _id          │
│ email    │     │    │ name     │     │    │ _collection  │
│ tier     │     │    │ userId   │─────┘    │ databaseId   │──┐
│ ...      │     │    │ ...      │          │ userId       │  │
└──────────┘     │    └──────────┘          │ _data        │  │
                 │                           │ ...          │  │
                 └───────────────────────────┘              │  │
                                                            │  │
                 Ownership Check: User owns Database? ──────┘  │
                                                               │
                 Count Check: How many data in collection? ────┘
```

## 9. Tier Upgrade Flow

```
┌──────────┐      ┌──────────────┐      ┌──────────────┐
│ Payment  │─────▶│ POST /tier/  │─────▶│ TierService  │
│ Success  │      │   upgrade    │      │ .upgradeTier │
└──────────┘      └──────────────┘      └──────┬───────┘
                                               │
                                               ▼
                                    ┌──────────────────┐
                                    │ 1. Find User     │
                                    │ 2. Save History  │
                                    │ 3. Update Tier   │
                                    │ 4. Set Dates     │
                                    └──────┬───────────┘
                                           │
                                           ▼
                                    ┌──────────────────┐
                                    │ User Updated     │
                                    │ tier: "premium"  │
                                    │ limits: 20 DBs   │
                                    │         10K data │
                                    └──────────────────┘
```

## 10. Frontend Integration Points

```
┌─────────────────────────────────────────────────────┐
│                 Frontend App                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌────────────────────────────────────────────┐   │
│  │          Before Action Checks              │   │
│  ├────────────────────────────────────────────┤   │
│  │                                            │   │
│  │  Create Database Button                    │   │
│  │  ├─▶ GET /tier/check-database-limit       │   │
│  │  └─▶ Show "Upgrade" modal if limit        │   │
│  │                                            │   │
│  │  Create Data Button                        │   │
│  │  ├─▶ GET /tier/check-data-limit/...       │   │
│  │  └─▶ Show warning if near limit           │   │
│  │                                            │   │
│  └────────────────────────────────────────────┘   │
│                                                     │
│  ┌────────────────────────────────────────────┐   │
│  │            Usage Dashboard                 │   │
│  ├────────────────────────────────────────────┤   │
│  │                                            │   │
│  │  GET /tier/info                            │   │
│  │  └─▶ Display: Tier, Limits, Usage         │   │
│  │                                            │   │
│  │  GET /tier/data-usage/:dbId                │   │
│  │  └─▶ Show progress bars per collection    │   │
│  │                                            │   │
│  └────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Legend

```
─────▶  Request flow
◄─────  Reference/Ownership
┌────┐  Component/Module
│    │  Container
═════  Important note
```
