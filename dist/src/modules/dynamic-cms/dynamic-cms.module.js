"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicCmsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const collection_schema_schema_1 = require("./schemas/collection-schema.schema");
const dynamic_data_schema_1 = require("./schemas/dynamic-data.schema");
const database_schema_1 = require("./schemas/database.schema");
const collection_schema_service_1 = require("./controller/collection-schema/collection-schema.service");
const collection_schema_controller_1 = require("./controller/collection-schema/collection-schema.controller");
const dynamic_data_service_1 = require("./controller/dynamic-data/dynamic-data.service");
const dynamic_data_controller_1 = require("./controller/dynamic-data/dynamic-data.controller");
const database_service_1 = require("./controller/database/database.service");
const database_controller_1 = require("./controller/database/database.controller");
const database_ownership_guard_1 = require("../../common/guards/database-ownership.guard");
let DynamicCmsModule = class DynamicCmsModule {
};
exports.DynamicCmsModule = DynamicCmsModule;
exports.DynamicCmsModule = DynamicCmsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: database_schema_1.Database.name, schema: database_schema_1.DatabaseSchema },
                { name: collection_schema_schema_1.CollectionSchemaModel.name, schema: collection_schema_schema_1.CollectionSchemaSchema },
                { name: dynamic_data_schema_1.DynamicData.name, schema: dynamic_data_schema_1.DynamicDataSchema },
            ]),
        ],
        controllers: [
            database_controller_1.DatabaseController,
            collection_schema_controller_1.CollectionSchemaController,
            dynamic_data_controller_1.DynamicDataController,
        ],
        providers: [
            database_service_1.DatabaseService,
            collection_schema_service_1.CollectionSchemaService,
            dynamic_data_service_1.DynamicDataService,
            database_ownership_guard_1.DatabaseOwnershipGuard,
        ],
        exports: [
            database_service_1.DatabaseService,
            collection_schema_service_1.CollectionSchemaService,
            dynamic_data_service_1.DynamicDataService,
            mongoose_1.MongooseModule,
        ],
    })
], DynamicCmsModule);
//# sourceMappingURL=dynamic-cms.module.js.map