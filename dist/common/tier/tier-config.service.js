"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TierConfigService", {
    enumerable: true,
    get: function() {
        return TierConfigService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _tierconfigschema = require("./schemas/tier-config.schema");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let TierConfigService = class TierConfigService {
    /**
   * Lấy tất cả tier configs
   */ async getAllTiers(includeInactive = false) {
        const query = includeInactive ? {} : {
            isActive: true
        };
        return this.tierConfigModel.find(query).sort({
            displayOrder: 1
        }).exec();
    }
    /**
   * Lấy tier config theo code
   */ async getTierByCode(tierCode) {
        // Kiểm tra cache trước
        const cached = this.getCachedTier(tierCode);
        if (cached) {
            return cached;
        }
        const tier = await this.tierConfigModel.findOne({
            tierCode,
            isActive: true
        }).exec();
        if (!tier) {
            throw new _common.NotFoundException(`Tier '${tierCode}' not found`);
        }
        // Lưu vào cache
        this.setCachedTier(tierCode, tier);
        return tier;
    }
    /**
   * Lấy tier limits (chỉ các thông tin giới hạn)
   */ async getTierLimits(tierCode) {
        const tier = await this.getTierByCode(tierCode);
        return {
            maxDatabases: tier.maxDatabases,
            maxDataPerCollection: tier.maxDataPerCollection,
            maxCollectionsPerDatabase: tier.maxCollectionsPerDatabase,
            maxStorageGB: tier.maxStorageGB,
            maxApiCallsPerDay: tier.maxApiCallsPerDay
        };
    }
    /**
   * Tạo tier mới
   */ async createTier(createDto) {
        // Kiểm tra tierCode đã tồn tại chưa
        const existing = await this.tierConfigModel.findOne({
            tierCode: createDto.tierCode
        }).exec();
        if (existing) {
            throw new _common.ConflictException(`Tier '${createDto.tierCode}' already exists`);
        }
        const tier = new this.tierConfigModel(createDto);
        const saved = await tier.save();
        // Clear cache để refresh
        this.clearCache();
        return saved;
    }
    /**
   * Cập nhật tier
   */ async updateTier(tierCode, updateDto) {
        const tier = await this.tierConfigModel.findOneAndUpdate({
            tierCode
        }, updateDto, {
            new: true
        }).exec();
        if (!tier) {
            throw new _common.NotFoundException(`Tier '${tierCode}' not found`);
        }
        // Clear cache
        this.clearCache();
        return tier;
    }
    /**
   * Xóa tier (soft delete bằng cách set isActive = false)
   */ async deleteTier(tierCode) {
        const result = await this.tierConfigModel.updateOne({
            tierCode
        }, {
            isActive: false
        }).exec();
        if (result.modifiedCount === 0) {
            throw new _common.NotFoundException(`Tier '${tierCode}' not found`);
        }
        // Clear cache
        this.clearCache();
    }
    /**
   * Hard delete tier (cẩn thận!)
   */ async hardDeleteTier(tierCode) {
        const result = await this.tierConfigModel.deleteOne({
            tierCode
        }).exec();
        if (result.deletedCount === 0) {
            throw new _common.NotFoundException(`Tier '${tierCode}' not found`);
        }
        // Clear cache
        this.clearCache();
    }
    /**
   * Kiểm tra giá trị có phải unlimited không
   */ isUnlimited(limit) {
        return limit === -1;
    }
    /**
   * Seed default tiers vào database
   */ async seedDefaultTiers() {
        const defaultTiers = [
            {
                tierCode: 'free',
                tierName: 'Free',
                description: 'Gói miễn phí cho người dùng mới',
                maxDatabases: 2,
                maxDataPerCollection: 100,
                maxCollectionsPerDatabase: 5,
                maxStorageGB: 1,
                maxApiCallsPerDay: 1000,
                price: 0,
                currency: 'USD',
                isActive: true,
                displayOrder: 0
            },
            {
                tierCode: 'basic',
                tierName: 'Basic',
                description: 'Gói cơ bản cho dự án nhỏ',
                maxDatabases: 5,
                maxDataPerCollection: 1000,
                maxCollectionsPerDatabase: 20,
                maxStorageGB: 5,
                maxApiCallsPerDay: 10000,
                price: 9.99,
                currency: 'USD',
                isActive: true,
                displayOrder: 1
            },
            {
                tierCode: 'premium',
                tierName: 'Premium',
                description: 'Gói cao cấp cho doanh nghiệp vừa',
                maxDatabases: 20,
                maxDataPerCollection: 10000,
                maxCollectionsPerDatabase: 100,
                maxStorageGB: 50,
                maxApiCallsPerDay: 100000,
                price: 49.99,
                currency: 'USD',
                isActive: true,
                displayOrder: 2
            },
            {
                tierCode: 'enterprise',
                tierName: 'Enterprise',
                description: 'Gói không giới hạn cho doanh nghiệp lớn',
                maxDatabases: -1,
                maxDataPerCollection: -1,
                maxCollectionsPerDatabase: -1,
                maxStorageGB: -1,
                maxApiCallsPerDay: -1,
                price: 199.99,
                currency: 'USD',
                isActive: true,
                displayOrder: 3
            }
        ];
        for (const tierDto of defaultTiers){
            const existing = await this.tierConfigModel.findOne({
                tierCode: tierDto.tierCode
            }).exec();
            if (!existing) {
                await this.tierConfigModel.create(tierDto);
            }
        }
        // Refresh cache
        this.clearCache();
    }
    /**
   * Cache management
   */ getCachedTier(tierCode) {
        const expiry = this.cacheExpiry.get(tierCode);
        if (expiry && Date.now() < expiry) {
            return this.tierCache.get(tierCode) || null;
        }
        return null;
    }
    setCachedTier(tierCode, tier) {
        this.tierCache.set(tierCode, tier);
        this.cacheExpiry.set(tierCode, Date.now() + this.CACHE_TTL);
    }
    clearCache() {
        this.tierCache.clear();
        this.cacheExpiry.clear();
        // Refresh cache sau khi clear
        this.refreshCache();
    }
    async refreshCache() {
        try {
            const tiers = await this.tierConfigModel.find({
                isActive: true
            }).exec();
            for (const tier of tiers){
                this.setCachedTier(tier.tierCode, tier);
            }
        } catch (error) {
            // Ignore errors during cache refresh
            console.error('Failed to refresh tier cache:', error);
        }
    }
    constructor(tierConfigModel){
        this.tierConfigModel = tierConfigModel;
        // Cache để tránh query database nhiều lần
        this.tierCache = new Map();
        this.cacheExpiry = new Map();
        this.CACHE_TTL = 5 * 60 * 1000; // 5 phút
        // Khởi tạo cache khi service start
        this.refreshCache();
    }
};
TierConfigService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_tierconfigschema.TierConfig.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], TierConfigService);

//# sourceMappingURL=tier-config.service.js.map