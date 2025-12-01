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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const content_schema_1 = require("./schemas/content.schema");
let ContentService = class ContentService {
    constructor(contentModel) {
        this.contentModel = contentModel;
    }
    async create(createContentDto) {
        const createdContent = new this.contentModel(createContentDto);
        return createdContent.save();
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        const query = search
            ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { excerpt: { $regex: search, $options: 'i' } },
                    { tags: { $in: [new RegExp(search, 'i')] } },
                ],
            }
            : {};
        const [data, total] = await Promise.all([
            this.contentModel
                .find(query)
                .populate('author', 'firstName lastName email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec(),
            this.contentModel.countDocuments(query).exec(),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        return this.contentModel
            .findById(id)
            .populate('author', 'firstName lastName email')
            .exec();
    }
    async findBySlug(slug) {
        return this.contentModel
            .findOne({ slug })
            .populate('author', 'firstName lastName email')
            .exec();
    }
    async findByStatus(status) {
        return this.contentModel
            .find({ status })
            .populate('author', 'firstName lastName email')
            .exec();
    }
    async update(id, updateContentDto) {
        if (updateContentDto.status === 'published') {
            updateContentDto['publishedAt'] = new Date();
        }
        return this.contentModel
            .findByIdAndUpdate(id, updateContentDto, { new: true })
            .populate('author', 'firstName lastName email')
            .exec();
    }
    async incrementViewCount(id) {
        return this.contentModel
            .findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true })
            .exec();
    }
    async remove(id) {
        return this.contentModel.findByIdAndDelete(id).exec();
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(content_schema_1.Content.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ContentService);
//# sourceMappingURL=content.service.js.map