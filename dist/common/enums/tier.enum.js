/**
 * Account Tier Enum
 * Định nghĩa các cấp bậc tài khoản trong hệ thống
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get AccountTier () {
        return AccountTier;
    },
    get TIER_LIMITS () {
        return TIER_LIMITS;
    },
    get getTierLimits () {
        return getTierLimits;
    },
    get isUnlimited () {
        return isUnlimited;
    }
});
var AccountTier = /*#__PURE__*/ function(AccountTier) {
    AccountTier["FREE"] = "free";
    AccountTier["BASIC"] = "basic";
    AccountTier["PREMIUM"] = "premium";
    AccountTier["ENTERPRISE"] = "enterprise";
    return AccountTier;
}({});
const TIER_LIMITS = {
    ["free"]: {
        maxDatabases: 2,
        maxDataPerCollection: 100,
        maxCollectionsPerDatabase: 5,
        maxStorageGB: 1,
        maxApiCallsPerDay: 1000
    },
    ["basic"]: {
        maxDatabases: 5,
        maxDataPerCollection: 1000,
        maxCollectionsPerDatabase: 20,
        maxStorageGB: 5,
        maxApiCallsPerDay: 10000
    },
    ["premium"]: {
        maxDatabases: 20,
        maxDataPerCollection: 10000,
        maxCollectionsPerDatabase: 100,
        maxStorageGB: 50,
        maxApiCallsPerDay: 100000
    },
    ["enterprise"]: {
        maxDatabases: -1,
        maxDataPerCollection: -1,
        maxCollectionsPerDatabase: -1,
        maxStorageGB: -1,
        maxApiCallsPerDay: -1
    }
};
function isUnlimited(limit) {
    return limit === -1;
}
function getTierLimits(tier) {
    return TIER_LIMITS[tier];
}

//# sourceMappingURL=tier.enum.js.map