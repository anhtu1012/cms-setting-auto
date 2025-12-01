"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SettingsController", {
    enumerable: true,
    get: function() {
        return SettingsController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _settingsservice = require("./settings.service");
const _settingdto = require("./dto/setting.dto");
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
let SettingsController = class SettingsController {
    create(createSettingDto) {
        return this.settingsService.create(createSettingDto);
    }
    findAll(paginationDto) {
        return this.settingsService.findAll(paginationDto);
    }
    findByCategory(category) {
        return this.settingsService.findByCategory(category);
    }
    findByKey(key) {
        return this.settingsService.findByKey(key);
    }
    findOne(id) {
        return this.settingsService.findOne(id);
    }
    update(id, updateSettingDto) {
        return this.settingsService.update(id, updateSettingDto);
    }
    updateByKey(key, body) {
        return this.settingsService.updateByKey(key, body.value);
    }
    remove(id) {
        return this.settingsService.remove(id);
    }
    constructor(settingsService){
        this.settingsService = settingsService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new setting'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Setting created successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid input data'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _settingdto.CreateSettingDto === "undefined" ? Object : _settingdto.CreateSettingDto
    ]),
    _ts_metadata("design:returntype", void 0)
], SettingsController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all settings with pagination'
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
        description: 'Settings retrieved successfully'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paginationdto.PaginationDto === "undefined" ? Object : _paginationdto.PaginationDto
    ]),
    _ts_metadata("design:returntype", void 0)
], SettingsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)('category/:category'),
    (0, _swagger.ApiOperation)({
        summary: 'Get settings by category'
    }),
    (0, _swagger.ApiParam)({
        name: 'category',
        enum: [
            'general',
            'appearance',
            'security',
            'notification',
            'integration'
        ]
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Settings found'
    }),
    _ts_param(0, (0, _common.Param)('category')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SettingsController.prototype, "findByCategory", null);
_ts_decorate([
    (0, _common.Get)('key/:key'),
    (0, _swagger.ApiOperation)({
        summary: 'Get setting by key'
    }),
    (0, _swagger.ApiParam)({
        name: 'key',
        example: 'site_name'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Setting found'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Setting not found'
    }),
    _ts_param(0, (0, _common.Param)('key')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SettingsController.prototype, "findByKey", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get setting by ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Setting found'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Setting not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SettingsController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Update setting by ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Setting updated successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Setting not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _settingdto.UpdateSettingDto === "undefined" ? Object : _settingdto.UpdateSettingDto
    ]),
    _ts_metadata("design:returntype", void 0)
], SettingsController.prototype, "update", null);
_ts_decorate([
    (0, _common.Patch)('key/:key'),
    (0, _swagger.ApiOperation)({
        summary: 'Update setting value by key'
    }),
    (0, _swagger.ApiParam)({
        name: 'key',
        example: 'site_name'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Setting updated successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Setting not found'
    }),
    _ts_param(0, (0, _common.Param)('key')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], SettingsController.prototype, "updateByKey", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SettingsController.prototype, "remove", null);
SettingsController = _ts_decorate([
    (0, _swagger.ApiTags)('settings'),
    (0, _common.Controller)('settings'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _settingsservice.SettingsService === "undefined" ? Object : _settingsservice.SettingsService
    ])
], SettingsController);

//# sourceMappingURL=settings.controller.js.map