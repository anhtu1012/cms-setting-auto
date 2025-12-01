"use strict";
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
    get CreateContentDto () {
        return CreateContentDto;
    },
    get UpdateContentDto () {
        return UpdateContentDto;
    }
});
const _classvalidator = require("class-validator");
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateContentDto = class CreateContentDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'Getting Started with NestJS',
        description: 'Content title'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateContentDto.prototype, "title", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'getting-started-with-nestjs',
        description: 'Content URL slug'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateContentDto.prototype, "slug", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Hello World'
                        }
                    ]
                }
            ]
        },
        description: 'Content body (rich text or any format)'
    }),
    _ts_metadata("design:type", Object)
], CreateContentDto.prototype, "body", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: [
            'draft',
            'published',
            'archived'
        ],
        default: 'draft',
        description: 'Content status'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)([
        'draft',
        'published',
        'archived'
    ]),
    _ts_metadata("design:type", String)
], CreateContentDto.prototype, "status", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '507f1f77bcf86cd799439011',
        description: 'Author user ID'
    }),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateContentDto.prototype, "author", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: [
            'nestjs',
            'typescript',
            'tutorial'
        ],
        description: 'Content tags'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    _ts_metadata("design:type", Array)
], CreateContentDto.prototype, "tags", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'Learn how to get started with NestJS framework',
        description: 'Content excerpt/summary'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateContentDto.prototype, "excerpt", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'https://example.com/featured.jpg',
        description: 'Featured image URL'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateContentDto.prototype, "featuredImage", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: {
            seo_title: 'Custom SEO Title',
            keywords: [
                'nest',
                'js'
            ]
        },
        description: 'Additional metadata'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], CreateContentDto.prototype, "metadata", void 0);
let UpdateContentDto = class UpdateContentDto {
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'Getting Started with NestJS',
        description: 'Content title'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateContentDto.prototype, "title", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'getting-started-with-nestjs',
        description: 'Content URL slug'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateContentDto.prototype, "slug", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Hello World'
                        }
                    ]
                }
            ]
        },
        description: 'Content body (rich text or any format)'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], UpdateContentDto.prototype, "body", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        enum: [
            'draft',
            'published',
            'archived'
        ],
        description: 'Content status'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)([
        'draft',
        'published',
        'archived'
    ]),
    _ts_metadata("design:type", String)
], UpdateContentDto.prototype, "status", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: [
            'nestjs',
            'typescript',
            'tutorial'
        ],
        description: 'Content tags'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsArray)(),
    _ts_metadata("design:type", Array)
], UpdateContentDto.prototype, "tags", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'Learn how to get started with NestJS framework',
        description: 'Content excerpt/summary'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateContentDto.prototype, "excerpt", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: 'https://example.com/featured.jpg',
        description: 'Featured image URL'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateContentDto.prototype, "featuredImage", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        example: {
            seo_title: 'Custom SEO Title',
            keywords: [
                'nest',
                'js'
            ]
        },
        description: 'Additional metadata'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], UpdateContentDto.prototype, "metadata", void 0);

//# sourceMappingURL=content.dto.js.map