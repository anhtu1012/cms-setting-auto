"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DynamicCmsModule", {
    enumerable: true,
    get: function() {
        return DynamicCmsModule;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _collectionschemaschema = require("./schemas/collection-schema.schema");
const _dynamicdataschema = require("./schemas/dynamic-data.schema");
const _databaseschema = require("./schemas/database.schema");
const _collectionschemaservice = require("./controller/collection-schema/collection-schema.service");
const _collectionschemacontroller = require("./controller/collection-schema/collection-schema.controller");
const _dynamicdataservice = require("./controller/dynamic-data/dynamic-data.service");
const _dynamicdatacontroller = require("./controller/dynamic-data/dynamic-data.controller");
const _relationshipservice = require("./controller/dynamic-data/relationship.service");
const _databaseservice = require("./controller/database/database.service");
const _databasecontroller = require("./controller/database/database.controller");
const _databaseownershipguard = require("../../common/guards/database-ownership.guard");
const _tierlimitsguard = require("../../common/guards/tier-limits.guard");
const _userschema = require("../users/schemas/user.schema");
const _tiermodule = require("../../common/tier/tier.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let DynamicCmsModule = class DynamicCmsModule {
};
DynamicCmsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _mongoose.MongooseModule.forFeature([
                {
                    name: _databaseschema.Database.name,
                    schema: _databaseschema.DatabaseSchema
                },
                {
                    name: _collectionschemaschema.CollectionSchemaModel.name,
                    schema: _collectionschemaschema.CollectionSchemaSchema
                },
                {
                    name: _dynamicdataschema.DynamicData.name,
                    schema: _dynamicdataschema.DynamicDataSchema
                },
                {
                    name: _userschema.User.name,
                    schema: _userschema.UserSchema
                }
            ]),
            _tiermodule.TierModule
        ],
        controllers: [
            _databasecontroller.DatabaseController,
            _collectionschemacontroller.CollectionSchemaController,
            _dynamicdatacontroller.DynamicDataController
        ],
        providers: [
            _databaseservice.DatabaseService,
            _collectionschemaservice.CollectionSchemaService,
            _dynamicdataservice.DynamicDataService,
            _relationshipservice.RelationshipService,
            _databaseownershipguard.DatabaseOwnershipGuard,
            _tierlimitsguard.TierLimitsGuard
        ],
        exports: [
            _databaseservice.DatabaseService,
            _collectionschemaservice.CollectionSchemaService,
            _dynamicdataservice.DynamicDataService,
            _relationshipservice.RelationshipService,
            _mongoose.MongooseModule
        ]
    })
], DynamicCmsModule);

//# sourceMappingURL=dynamic-cms.module.js.map