"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersController", {
    enumerable: true,
    get: function() {
        return UsersController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _usersservice = require("./users.service");
const _userdto = require("./dto/user.dto");
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
let UsersController = class UsersController {
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    findAll(paginationDto) {
        return this.usersService.findAll(paginationDto);
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
    constructor(usersService){
        this.usersService = usersService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new user'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'User created successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid input data'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userdto.CreateUserDto === "undefined" ? Object : _userdto.CreateUserDto
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all users with pagination'
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
        description: 'Users retrieved successfully'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _paginationdto.PaginationDto === "undefined" ? Object : _paginationdto.PaginationDto
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Get user by ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'User found'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'User not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Update user by ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'User updated successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'User not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _userdto.UpdateUserDto === "undefined" ? Object : _userdto.UpdateUserDto
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    (0, _swagger.ApiOperation)({
        summary: 'Delete user by ID'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'User deleted successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'User not found'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
UsersController = _ts_decorate([
    (0, _swagger.ApiTags)('users'),
    (0, _common.Controller)('users'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService
    ])
], UsersController);

//# sourceMappingURL=users.controller.js.map