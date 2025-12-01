"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ContentController", {
    enumerable: true,
    get: function() {
        return ContentController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _contentservice = require("./content.service");
const _contentdto = require("./dto/content.dto");
const _paginationdto = require("../../common/dto/pagination.dto");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
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
let ContentController = class ContentController {
    create(createContentDto) {
        return this.contentService.create(createContentDto);
    }
    findAll(paginationDto) {
        return this.contentService.findAll(paginationDto);
    }
    findByStatus(status) {
        return this.contentService.findByStatus(status);
    }
    findBySlug(slug) {
        return this.contentService.findBySlug(slug);
    }
    findOne(id) {
        return this.contentService.findOne(id);
    }
    update(id, updateContentDto) {
        return this.contentService.update(id, updateContentDto);
    }
    incrementViewCount(id) {
        return this.contentService.incrementViewCount(id);
    }
    remove(id) {
        return this.contentService.remove(id);
    }
    constructor(contentService){
        this.contentService = contentService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create new content'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Content created successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid input data'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _contentdto.CreateContentDto === "undefined" ? Object : _contentdto.CreateContentDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ContentController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all content with pagination'
    }),
    (0, _swagger.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        example: 1
    }),
    (0, _swagger.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        example: 10
    }),
    (0, _swagger.ApiQuery)({
        name: 'search',
        required: false,
        type: String
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Content retrieved successfully'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paginationdto.PaginationDto === "undefined" ? Object : _paginationdto.PaginationDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ContentController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)('status/:status'),
    (0, _swagger.ApiOperation)({
        summary: 'Get content by status'
    }),
    (0, _swagger.ApiParam)({
        name: 'status',
        enum: [
            'draft',
            'published',
            'archived'
        ]
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Content found'
    }),
    _ts_param(0, (0, _common.Param)('status')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ContentController.prototype, "findByStatus", null);
_ts_decorate([
    (0, _common.Get)('slug/:slug'),
    (0, _swagger.ApiOperation)({
        summary: 'Get content by slug'
    }),
    (0, _swagger.ApiParam)({
        name: 'slug',
        example: 'getting-started-with-nestjs'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Content found'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Content not found'
    }),
    _ts_param(0, (0, _common.Param)('slug')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ContentController.prototype, "findBySlug", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get content by ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Content found'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Content not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ContentController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Update content by ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Content updated successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Content not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _contentdto.UpdateContentDto === "undefined" ? Object : _contentdto.UpdateContentDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ContentController.prototype, "update", null);
_ts_decorate([
    (0, _common.Patch)(':id/view'),
    (0, _swagger.ApiOperation)({
        summary: 'Increment content view count'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'View count incremented'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ContentController.prototype, "incrementViewCount", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], ContentController.prototype, "remove", null);
ContentController = _ts_decorate([
    (0, _swagger.ApiTags)('content'),
    (0, _common.Controller)('content'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _contentservice.ContentService === "undefined" ? Object : _contentservice.ContentService
    ])
], ContentController);

//# sourceMappingURL=content.controller.js.map