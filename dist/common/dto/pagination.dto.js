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
    get PaginationDto () {
        return PaginationDto;
    },
    get PaginationResponse () {
        return PaginationResponse;
    }
});
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
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
let PaginationDto = class PaginationDto {
    constructor(){
        this.page = 1;
        this.limit = 10;
    }
};
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Page number',
        example: 1,
        default: 1
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classtransformer.Type)(()=>Number),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(1),
    _ts_metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Items per page',
        example: 10,
        default: 10
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classtransformer.Type)(()=>Number),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(1),
    _ts_metadata("design:type", Number)
], PaginationDto.prototype, "limit", void 0);
_ts_decorate([
    (0, _swagger.ApiPropertyOptional)({
        description: 'Search keyword',
        example: 'product'
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], PaginationDto.prototype, "search", void 0);
let PaginationResponse = class PaginationResponse {
};

//# sourceMappingURL=pagination.dto.js.map