/**
 * Account Tier Enum
 * Định nghĩa các cấp bậc tài khoản trong hệ thống
 */
export enum AccountTier {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

/**
 * Tier Limits Interface
 * Định nghĩa giới hạn cho mỗi cấp bậc
 */
export interface TierLimits {
  maxDatabases: number; // Giới hạn số database có thể tạo
  maxDataPerCollection: number; // Giới hạn số data trong mỗi collection
  maxCollectionsPerDatabase: number; // Giới hạn số collection trong mỗi database
  maxStorageGB: number; // Giới hạn dung lượng lưu trữ (GB)
  maxApiCallsPerDay: number; // Giới hạn API calls mỗi ngày
}

/**
 * Tier Configuration
 * Cấu hình giới hạn cho từng tier
 */
export const TIER_LIMITS: Record<AccountTier, TierLimits> = {
  [AccountTier.FREE]: {
    maxDatabases: 2,
    maxDataPerCollection: 100,
    maxCollectionsPerDatabase: 5,
    maxStorageGB: 1,
    maxApiCallsPerDay: 1000,
  },
  [AccountTier.BASIC]: {
    maxDatabases: 5,
    maxDataPerCollection: 1000,
    maxCollectionsPerDatabase: 20,
    maxStorageGB: 5,
    maxApiCallsPerDay: 10000,
  },
  [AccountTier.PREMIUM]: {
    maxDatabases: 20,
    maxDataPerCollection: 10000,
    maxCollectionsPerDatabase: 100,
    maxStorageGB: 50,
    maxApiCallsPerDay: 100000,
  },
  [AccountTier.ENTERPRISE]: {
    maxDatabases: -1, // Unlimited
    maxDataPerCollection: -1, // Unlimited
    maxCollectionsPerDatabase: -1, // Unlimited
    maxStorageGB: -1, // Unlimited
    maxApiCallsPerDay: -1, // Unlimited
  },
};

/**
 * Kiểm tra xem một giá trị có phải là unlimited không
 */
export function isUnlimited(limit: number): boolean {
  return limit === -1;
}

/**
 * Lấy thông tin giới hạn theo tier
 */
export function getTierLimits(tier: AccountTier): TierLimits {
  return TIER_LIMITS[tier];
}
