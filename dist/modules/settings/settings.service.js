"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SettingsService", {
    enumerable: true,
    get: function() {
        return SettingsService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _settingschema = require("./schemas/setting.schema");
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
let SettingsService = class SettingsService {
    async create(createSettingDto) {
        const createdSetting = new this.settingModel(createSettingDto);
        return createdSetting.save();
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        const query = search ? {
            $or: [
                {
                    key: {
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
            ]
        } : {};
        const [data, total] = await Promise.all([
            this.settingModel.find(query).skip(skip).limit(limit).exec(),
            this.settingModel.countDocuments(query).exec()
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
        return this.settingModel.findById(id).exec();
    }
    async findByKey(key) {
        return this.settingModel.findOne({
            key
        }).exec();
    }
    async findByCategory(category) {
        return this.settingModel.find({
            category
        }).exec();
    }
    async update(id, updateSettingDto) {
        return this.settingModel.findByIdAndUpdate(id, updateSettingDto, {
            new: true
        }).exec();
    }
    async updateByKey(key, value) {
        return this.settingModel.findOneAndUpdate({
            key
        }, {
            value
        }, {
            new: true
        }).exec();
    }
    async remove(id) {
        return this.settingModel.findByIdAndDelete(id).exec();
    }
    constructor(settingModel){
        this.settingModel = settingModel;
    }
};
SettingsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_settingschema.Setting.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model
    ])
], SettingsService);

//# sourceMappingURL=settings.service.js.map