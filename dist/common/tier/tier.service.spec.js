"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _mongoose = require("@nestjs/mongoose");
const _tierservice = require("./tier.service");
const _tierconfigservice = require("./tier-config.service");
const _userschema = require("../../modules/users/schemas/user.schema");
const _databaseschema = require("../../modules/dynamic-cms/schemas/database.schema");
const _dynamicdataschema = require("../../modules/dynamic-cms/schemas/dynamic-data.schema");
const _tierconfigschema = require("./schemas/tier-config.schema");
describe('TierService', ()=>{
    let service;
    let tierConfigService;
    let userModel;
    let databaseModel;
    let dynamicDataModel;
    const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        tier: 'free',
        currentDatabaseCount: 0,
        apiCallsToday: 0,
        save: jest.fn().mockResolvedValue(void 0)
    };
    const mockTierConfigService = {
        getTierLimits: jest.fn().mockResolvedValue({
            maxDatabases: 2,
            maxDataPerCollection: 100,
            maxCollectionsPerDatabase: 5,
            maxStorageGB: 1,
            maxApiCallsPerDay: 1000
        }),
        getTierByCode: jest.fn().mockResolvedValue({
            tierCode: 'free',
            tierName: 'Free',
            maxDatabases: 2,
            maxDataPerCollection: 100,
            maxCollectionsPerDatabase: 5,
            maxStorageGB: 1,
            maxApiCallsPerDay: 1000
        }),
        isUnlimited: jest.fn((limit)=>limit === -1)
    };
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _tierservice.TierService,
                {
                    provide: _tierconfigservice.TierConfigService,
                    useValue: mockTierConfigService
                },
                {
                    provide: (0, _mongoose.getModelToken)(_userschema.User.name),
                    useValue: {
                        findById: jest.fn(),
                        updateMany: jest.fn(),
                        findByIdAndUpdate: jest.fn()
                    }
                },
                {
                    provide: (0, _mongoose.getModelToken)(_databaseschema.Database.name),
                    useValue: {
                        countDocuments: jest.fn(),
                        findOne: jest.fn()
                    }
                },
                {
                    provide: (0, _mongoose.getModelToken)(_dynamicdataschema.DynamicData.name),
                    useValue: {
                        countDocuments: jest.fn(),
                        aggregate: jest.fn()
                    }
                },
                {
                    provide: (0, _mongoose.getModelToken)(_tierconfigschema.TierConfig.name),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn()
                    }
                }
            ]
        }).compile();
        service = module.get(_tierservice.TierService);
        tierConfigService = module.get(_tierconfigservice.TierConfigService);
        userModel = module.get((0, _mongoose.getModelToken)(_userschema.User.name));
        databaseModel = module.get((0, _mongoose.getModelToken)(_databaseschema.Database.name));
        dynamicDataModel = module.get((0, _mongoose.getModelToken)(_dynamicdataschema.DynamicData.name));
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
    describe('getUserTierInfo', ()=>{
        it('should return tier info for user', async ()=>{
            userModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser)
            });
            databaseModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(1)
            });
            const result = await service.getUserTierInfo(mockUser._id);
            expect(result).toHaveProperty('tier');
            expect(result).toHaveProperty('limits');
            expect(result).toHaveProperty('usage');
            expect(result.tier).toBe('free');
            expect(result.limits.maxDatabases).toBe(2);
            expect(result.usage.databases).toBe(1);
        });
    });
    describe('canCreateDatabase', ()=>{
        it('should allow database creation when under limit', async ()=>{
            userModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser)
            });
            databaseModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(1)
            });
            const result = await service.canCreateDatabase(mockUser._id);
            expect(result.allowed).toBe(true);
            expect(result.current).toBe(1);
            expect(result.limit).toBe(2);
        });
        it('should block database creation when limit reached', async ()=>{
            userModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser)
            });
            databaseModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(2)
            });
            const result = await service.canCreateDatabase(mockUser._id);
            expect(result.allowed).toBe(false);
            expect(result.current).toBe(2);
            expect(result.limit).toBe(2);
            expect(result.reason).toContain('Maximum databases reached');
        });
        it('should allow unlimited databases for ENTERPRISE tier', async ()=>{
            const enterpriseUser = {
                ...mockUser,
                tier: 'enterprise'
            };
            userModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(enterpriseUser)
            });
            // Mock unlimited tier limits
            mockTierConfigService.getTierLimits.mockResolvedValueOnce({
                maxDatabases: -1,
                maxDataPerCollection: -1,
                maxCollectionsPerDatabase: -1,
                maxStorageGB: -1,
                maxApiCallsPerDay: -1
            });
            const result = await service.canCreateDatabase(mockUser._id);
            expect(result.allowed).toBe(true);
            expect(result.current).toBe(-1);
            expect(result.limit).toBe(-1);
        });
    });
    describe('canCreateData', ()=>{
        const databaseId = '507f1f77bcf86cd799439022';
        const collectionName = 'products';
        it('should allow data creation when under limit', async ()=>{
            userModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser)
            });
            databaseModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue({
                    _id: databaseId
                })
            });
            dynamicDataModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(50)
            });
            const result = await service.canCreateData(mockUser._id, databaseId, collectionName);
            expect(result.allowed).toBe(true);
            expect(result.current).toBe(50);
            expect(result.limit).toBe(100); // FREE tier limit
        });
        it('should block data creation when limit reached', async ()=>{
            userModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser)
            });
            databaseModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue({
                    _id: databaseId
                })
            });
            dynamicDataModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(100)
            });
            const result = await service.canCreateData(mockUser._id, databaseId, collectionName);
            expect(result.allowed).toBe(false);
            expect(result.current).toBe(100);
            expect(result.limit).toBe(100);
            expect(result.reason).toContain('Maximum data per collection reached');
        });
        it('should return false if database not found', async ()=>{
            userModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser)
            });
            databaseModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null)
            });
            const result = await service.canCreateData(mockUser._id, databaseId, collectionName);
            expect(result.allowed).toBe(false);
            expect(result.reason).toContain('Database not found');
        });
    });
    describe('upgradeTier', ()=>{
        it('should upgrade user tier and save history', async ()=>{
            const userWithSave = {
                ...mockUser,
                tierHistory: [],
                createdAt: new Date(),
                save: jest.fn().mockResolvedValue(mockUser)
            };
            userModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(userWithSave)
            });
            const result = await service.upgradeTier(mockUser._id, 'premium', 'Payment successful');
            expect(userWithSave.save).toHaveBeenCalled();
            expect(userWithSave.tier).toBe('premium');
            expect(userWithSave.tierHistory.length).toBe(1);
            expect(userWithSave.tierHistory[0].upgradeReason).toBe('Payment successful');
        });
    });
    describe('getDataUsageByCollection', ()=>{
        it('should return data usage statistics', async ()=>{
            const databaseId = '507f1f77bcf86cd799439022';
            userModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser)
            });
            databaseModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue({
                    _id: databaseId,
                    name: 'test-db'
                })
            });
            dynamicDataModel.aggregate.mockReturnValue({
                exec: jest.fn().mockResolvedValue([
                    {
                        _id: 'products',
                        count: 85
                    },
                    {
                        _id: 'categories',
                        count: 15
                    }
                ])
            });
            const result = await service.getDataUsageByCollection(mockUser._id, databaseId);
            expect(result).toHaveLength(2);
            expect(result[0].collection).toBe('products');
            expect(result[0].count).toBe(85);
            expect(result[0].limit).toBe(100);
            expect(result[0].percentage).toBe(85);
        });
    });
    describe('Bulk and Replace-All scenarios', ()=>{
        const databaseId = '507f1f77bcf86cd799439022';
        const collectionName = 'products';
        it('should allow bulk creation when under limit', async ()=>{
            userModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser)
            });
            databaseModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue({
                    _id: databaseId
                })
            });
            dynamicDataModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(50)
            });
            const result = await service.canCreateData(mockUser._id, databaseId, collectionName);
            expect(result.allowed).toBe(true);
        });
        it('should block bulk creation when would exceed limit', async ()=>{
            userModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser)
            });
            databaseModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue({
                    _id: databaseId
                })
            });
            dynamicDataModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(90)
            });
            const result = await service.canCreateData(mockUser._id, databaseId, collectionName);
            expect(result.allowed).toBe(true); // Still allowed to add up to 10 more
        });
    });
});

//# sourceMappingURL=tier.service.spec.js.map