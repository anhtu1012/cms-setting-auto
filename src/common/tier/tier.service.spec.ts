import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TierService } from './tier.service';
import { User } from '../../modules/users/schemas/user.schema';
import { Database } from '../../modules/dynamic-cms/schemas/database.schema';
import { DynamicData } from '../../modules/dynamic-cms/schemas/dynamic-data.schema';
import { AccountTier } from '../enums/tier.enum';

describe('TierService', () => {
  let service: TierService;
  let userModel: any;
  let databaseModel: any;
  let dynamicDataModel: any;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    tier: AccountTier.FREE,
    currentDatabaseCount: 0,
    apiCallsToday: 0,
    save: jest.fn().mockResolvedValue(this),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TierService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn(),
            updateMany: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: getModelToken(Database.name),
          useValue: {
            countDocuments: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken(DynamicData.name),
          useValue: {
            countDocuments: jest.fn(),
            aggregate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TierService>(TierService);
    userModel = module.get(getModelToken(User.name));
    databaseModel = module.get(getModelToken(Database.name));
    dynamicDataModel = module.get(getModelToken(DynamicData.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserTierInfo', () => {
    it('should return tier info for user', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      databaseModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await service.getUserTierInfo(mockUser._id);

      expect(result).toHaveProperty('tier');
      expect(result).toHaveProperty('limits');
      expect(result).toHaveProperty('usage');
      expect(result.tier).toBe(AccountTier.FREE);
      expect(result.limits.maxDatabases).toBe(2);
      expect(result.usage.databases).toBe(1);
    });
  });

  describe('canCreateDatabase', () => {
    it('should allow database creation when under limit', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      databaseModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1), // User has 1 database
      });

      const result = await service.canCreateDatabase(mockUser._id);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(1);
      expect(result.limit).toBe(2);
    });

    it('should block database creation when limit reached', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      databaseModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(2), // User has 2 databases (FREE limit)
      });

      const result = await service.canCreateDatabase(mockUser._id);

      expect(result.allowed).toBe(false);
      expect(result.current).toBe(2);
      expect(result.limit).toBe(2);
      expect(result.reason).toContain('Maximum databases reached');
    });

    it('should allow unlimited databases for ENTERPRISE tier', async () => {
      const enterpriseUser = { ...mockUser, tier: AccountTier.ENTERPRISE };

      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(enterpriseUser),
      });

      const result = await service.canCreateDatabase(mockUser._id);

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(-1);
      expect(result.limit).toBe(-1);
    });
  });

  describe('canCreateData', () => {
    const databaseId = '507f1f77bcf86cd799439022';
    const collectionName = 'products';

    it('should allow data creation when under limit', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      databaseModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: databaseId }),
      });

      dynamicDataModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(50), // 50 data items
      });

      const result = await service.canCreateData(
        mockUser._id,
        databaseId,
        collectionName,
      );

      expect(result.allowed).toBe(true);
      expect(result.current).toBe(50);
      expect(result.limit).toBe(100); // FREE tier limit
    });

    it('should block data creation when limit reached', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      databaseModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: databaseId }),
      });

      dynamicDataModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(100), // Reached FREE limit
      });

      const result = await service.canCreateData(
        mockUser._id,
        databaseId,
        collectionName,
      );

      expect(result.allowed).toBe(false);
      expect(result.current).toBe(100);
      expect(result.limit).toBe(100);
      expect(result.reason).toContain('Maximum data per collection reached');
    });

    it('should return false if database not found', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      databaseModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.canCreateData(
        mockUser._id,
        databaseId,
        collectionName,
      );

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Database not found');
    });
  });

  describe('upgradeTier', () => {
    it('should upgrade user tier and save history', async () => {
      const userWithSave = {
        ...mockUser,
        tierHistory: [],
        createdAt: new Date(),
        save: jest.fn().mockResolvedValue(mockUser),
      };

      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(userWithSave),
      });

      const result = await service.upgradeTier(
        mockUser._id,
        AccountTier.PREMIUM,
        'Payment successful',
      );

      expect(userWithSave.save).toHaveBeenCalled();
      expect(userWithSave.tier).toBe(AccountTier.PREMIUM);
      expect(userWithSave.tierHistory.length).toBe(1);
      expect(userWithSave.tierHistory[0].upgradeReason).toBe(
        'Payment successful',
      );
    });
  });

  describe('getDataUsageByCollection', () => {
    it('should return data usage statistics', async () => {
      const databaseId = '507f1f77bcf86cd799439022';

      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      dynamicDataModel.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          { _id: 'products', count: 85 },
          { _id: 'categories', count: 15 },
        ]),
      });

      const result = await service.getDataUsageByCollection(
        mockUser._id,
        databaseId,
      );

      expect(result).toHaveLength(2);
      expect(result[0].collection).toBe('products');
      expect(result[0].count).toBe(85);
      expect(result[0].limit).toBe(100);
      expect(result[0].percentage).toBe(85);
    });
  });

  describe('Bulk and Replace-All scenarios', () => {
    const databaseId = '507f1f77bcf86cd799439022';
    const collectionName = 'products';

    it('should allow bulk creation when under limit', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      databaseModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: databaseId }),
      });

      dynamicDataModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(50), // Current: 50, adding 30 = 80 (under 100)
      });

      const result = await service.canCreateData(
        mockUser._id,
        databaseId,
        collectionName,
      );

      expect(result.allowed).toBe(true);
    });

    it('should block bulk creation when would exceed limit', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      databaseModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: databaseId }),
      });

      dynamicDataModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(90), // Current: 90, adding 20 would exceed 100
      });

      const result = await service.canCreateData(
        mockUser._id,
        databaseId,
        collectionName,
      );

      expect(result.allowed).toBe(true); // Still allowed to add up to 10 more
    });
  });
});
