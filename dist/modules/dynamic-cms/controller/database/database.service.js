"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DatabaseService", {
    enumerable: true,
    get: function() {
        return DatabaseService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _databaseschema = require("../../schemas/database.schema");
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
let DatabaseService = class DatabaseService {
    /**
   * Tạo database mới cho user
   */ async create(createDatabaseDto, userId) {
        // Check if database name already exists for this user
        const existing = await this.databaseModel.findOne({
            userId: new _mongoose1.Types.ObjectId(userId),
            name: createDatabaseDto.name
        }).exec();
        if (existing) {
            throw new _common.ConflictException(`Database with name "${createDatabaseDto.name}" already exists`);
        }
        const database = new this.databaseModel({
            ...createDatabaseDto,
            userId: new _mongoose1.Types.ObjectId(userId),
            createdBy: userId
        });
        const saved = await database.save();
        return this.toResponseDto(saved);
    }
    /**
   * Lấy tất cả databases của user với phân trang
   */ async findAllByUser(userId, paginationDto) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        const query = {
            userId: new _mongoose1.Types.ObjectId(userId)
        };
        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    displayName: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ];
        }
        const [data, total] = await Promise.all([
            this.databaseModel.find(query).sort({
                createdAt: -1
            }).skip(skip).limit(limit).exec(),
            this.databaseModel.countDocuments(query).exec()
        ]);
        return {
            data: data.map((db)=>this.toResponseDto(db)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    /**
   * Lấy database theo ID và kiểm tra ownership
   */ async findOne(id, userId) {
        const database = await this.databaseModel.findById(id).exec();
        if (!database) {
            throw new _common.NotFoundException(`Database with ID "${id}" not found`);
        }
        // Check ownership
        if (database.userId.toString() !== userId) {
            throw new _common.ForbiddenException('You do not have access to this database');
        }
        return this.toResponseDto(database);
    }
    /**
   * Cập nhật database
   */ async update(id, updateDatabaseDto, userId) {
        const database = await this.databaseModel.findById(id).exec();
        if (!database) {
            throw new _common.NotFoundException(`Database with ID "${id}" not found`);
        }
        // Check ownership
        if (database.userId.toString() !== userId) {
            throw new _common.ForbiddenException('You do not have access to this database');
        }
        // Check name uniqueness if changing name
        if (updateDatabaseDto.name && updateDatabaseDto.name !== database.name) {
            const existing = await this.databaseModel.findOne({
                userId: new _mongoose1.Types.ObjectId(userId),
                name: updateDatabaseDto.name,
                _id: {
                    $ne: id
                }
            }).exec();
            if (existing) {
                throw new _common.ConflictException(`Database with name "${updateDatabaseDto.name}" already exists`);
            }
        }
        Object.assign(database, updateDatabaseDto);
        database.updatedBy = userId;
        const updated = await database.save();
        return this.toResponseDto(updated);
    }
    /**
   * Xóa database (soft delete - chỉ set isActive = false)
   */ async remove(id, userId) {
        const database = await this.databaseModel.findById(id).exec();
        if (!database) {
            throw new _common.NotFoundException(`Database with ID "${id}" not found`);
        }
        // Check ownership
        if (database.userId.toString() !== userId) {
            throw new _common.ForbiddenException('You do not have access to this database');
        }
        database.isActive = false;
        database.updatedBy = userId;
        await database.save();
        return {
            message: 'Database deactivated successfully'
        };
    }
    /**
   * Xóa database vĩnh viễn (hard delete)
   */ async permanentDelete(id, userId) {
        const database = await this.databaseModel.findById(id).exec();
        if (!database) {
            throw new _common.NotFoundException(`Database with ID "${id}" not found`);
        }
        // Check ownership
        if (database.userId.toString() !== userId) {
            throw new _common.ForbiddenException('You do not have access to this database');
        }
        await this.databaseModel.findByIdAndDelete(id).exec();
        return {
            message: 'Database permanently deleted'
        };
    }
    /**
   * Cập nhật số lượng collections và data
   */ async updateCounts(databaseId, collectionsCount, dataCount) {
        const update = {};
        if (collectionsCount !== undefined) update.collectionsCount = collectionsCount;
        if (dataCount !== undefined) update.dataCount = dataCount;
        await this.databaseModel.findByIdAndUpdate(databaseId, update).exec();
    }
    /**
   * Convert document to response DTO
   */ toResponseDto(database) {
        return {
            id: database._id.toString(),
            name: database.name,
            displayName: database.displayName,
            description: database.description,
            userId: database.userId.toString(),
            isActive: database.isActive,
            icon: database.icon,
            settings: database.settings,
            tags: database.tags,
            collectionsCount: database.collectionsCount || 0,
            dataCount: database.dataCount || 0,
            createdAt: database.createdAt,
            updatedAt: database.updatedAt
        };
    }
    constructor(databaseModel){
        this.databaseModel = databaseModel;
    }
};
DatabaseService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_databaseschema.Database.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], DatabaseService);

//# sourceMappingURL=database.service.js.map