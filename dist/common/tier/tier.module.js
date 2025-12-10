"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TierModule", {
    enumerable: true,
    get: function() {
        return TierModule;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _tierservice = require("./tier.service");
const _tierconfigservice = require("./tier-config.service");
const _tierconfigcontroller = require("./tier-config.controller");
const _userschema = require("../../modules/users/schemas/user.schema");
const _databaseschema = require("../../modules/dynamic-cms/schemas/database.schema");
const _dynamicdataschema = require("../../modules/dynamic-cms/schemas/dynamic-data.schema");
const _tierconfigschema = require("./schemas/tier-config.schema");
const _tiercontroller = require("./tier.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TierModule = class TierModule {
};
TierModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _mongoose.MongooseModule.forFeature([
                {
                    name: _userschema.User.name,
                    schema: _userschema.UserSchema
                },
                {
                    name: _databaseschema.Database.name,
                    schema: _databaseschema.DatabaseSchema
                },
                {
                    name: _dynamicdataschema.DynamicData.name,
                    schema: _dynamicdataschema.DynamicDataSchema
                },
                {
                    name: _tierconfigschema.TierConfig.name,
                    schema: _tierconfigschema.TierConfigSchema
                }
            ])
        ],
        controllers: [
            _tiercontroller.TierController,
            _tierconfigcontroller.TierConfigController
        ],
        providers: [
            _tierservice.TierService,
            _tierconfigservice.TierConfigService
        ],
        exports: [
            _tierservice.TierService,
            _tierconfigservice.TierConfigService
        ]
    })
], TierModule);

//# sourceMappingURL=tier.module.js.map