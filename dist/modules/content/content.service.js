"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ContentService", {
    enumerable: true,
    get: function() {
        return ContentService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _contentschema = require("./schemas/content.schema");
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
let ContentService = class ContentService {
    async create(createContentDto) {
        const createdContent = new this.contentModel(createContentDto);
        return createdContent.save();
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        const query = search ? {
            $or: [
                {
                    title: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    excerpt: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    tags: {
                        $in: [
                            new RegExp(search, 'i')
                        ]
                    }
                }
            ]
        } : {};
        const [data, total] = await Promise.all([
            this.contentModel.find(query).populate('author', 'firstName lastName email').skip(skip).limit(limit).sort({
                createdAt: -1
            }).exec(),
            this.contentModel.countDocuments(query).exec()
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findOne(id) {
        return this.contentModel.findById(id).populate('author', 'firstName lastName email').exec();
    }
    async findBySlug(slug) {
        return this.contentModel.findOne({
            slug
        }).populate('author', 'firstName lastName email').exec();
    }
    async findByStatus(status) {
        return this.contentModel.find({
            status
        }).populate('author', 'firstName lastName email').exec();
    }
    async update(id, updateContentDto) {
        if (updateContentDto.status === 'published') {
            updateContentDto['publishedAt'] = new Date();
        }
        return this.contentModel.findByIdAndUpdate(id, updateContentDto, {
            new: true
        }).populate('author', 'firstName lastName email').exec();
    }
    async incrementViewCount(id) {
        return this.contentModel.findByIdAndUpdate(id, {
            $inc: {
                viewCount: 1
            }
        }, {
            new: true
        }).exec();
    }
    async remove(id) {
        return this.contentModel.findByIdAndDelete(id).exec();
    }
    constructor(contentModel){
        this.contentModel = contentModel;
    }
};
ContentService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_contentschema.Content.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], ContentService);

//# sourceMappingURL=content.service.js.map