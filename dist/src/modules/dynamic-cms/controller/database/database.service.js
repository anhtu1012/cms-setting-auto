"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const database_schema_1 = require("../../schemas/database.schema");
let DatabaseService = class DatabaseService {
    constructor(databaseModel) {
        this.databaseModel = databaseModel;
    }
    async create(createDatabaseDto, userId) {
        const existing = await this.databaseModel
            .findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            name: createDatabaseDto.name,
        })
            .exec();
        if (existing) {
            throw new common_1.ConflictException(`Database with name "${createDatabaseDto.name}" already exists`);
        }
        const database = new this.databaseModel({
            ...createDatabaseDto,
            userId: new mongoose_2.Types.ObjectId(userId),
            createdBy: userId,
        });
        const saved = await database.save();
        return this.toResponseDto(saved);
    }
    async findAllByUser(userId, paginationDto) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        const query = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { displayName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.databaseModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.databaseModel.countDocuments(query).exec(),
        ]);
        return {
            data: data.map((db) => this.toResponseDto(db)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id, userId) {
        const database = await this.databaseModel.findById(id).exec();
        if (!database) {
            throw new common_1.NotFoundException(`Database with ID "${id}" not found`);
        }
        if (database.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this database');
        }
        return this.toResponseDto(database);
    }
    async update(id, updateDatabaseDto, userId) {
        const database = await this.databaseModel.findById(id).exec();
        if (!database) {
            throw new common_1.NotFoundException(`Database with ID "${id}" not found`);
        }
        if (database.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this database');
        }
        if (updateDatabaseDto.name && updateDatabaseDto.name !== database.name) {
            const existing = await this.databaseModel
                .findOne({
                userId: new mongoose_2.Types.ObjectId(userId),
                name: updateDatabaseDto.name,
                _id: { $ne: id },
            })
                .exec();
            if (existing) {
                throw new common_1.ConflictException(`Database with name "${updateDatabaseDto.name}" already exists`);
            }
        }
        Object.assign(database, updateDatabaseDto);
        database.updatedBy = userId;
        const updated = await database.save();
        return this.toResponseDto(updated);
    }
    async remove(id, userId) {
        const database = await this.databaseModel.findById(id).exec();
        if (!database) {
            throw new common_1.NotFoundException(`Database with ID "${id}" not found`);
        }
        if (database.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this database');
        }
        database.isActive = false;
        database.updatedBy = userId;
        await database.save();
        return { message: 'Database deactivated successfully' };
    }
    async permanentDelete(id, userId) {
        const database = await this.databaseModel.findById(id).exec();
        if (!database) {
            throw new common_1.NotFoundException(`Database with ID "${id}" not found`);
        }
        if (database.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this database');
        }
        await this.databaseModel.findByIdAndDelete(id).exec();
        return { message: 'Database permanently deleted' };
    }
    async updateCounts(databaseId, collectionsCount, dataCount) {
        const update = {};
        if (collectionsCount !== undefined)
            update.collectionsCount = collectionsCount;
        if (dataCount !== undefined)
            update.dataCount = dataCount;
        await this.databaseModel.findByIdAndUpdate(databaseId, update).exec();
    }
    toResponseDto(database) {
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
            updatedAt: database.updatedAt,
        };
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(database_schema_1.Database.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DatabaseService);
//# sourceMappingURL=database.service.js.map