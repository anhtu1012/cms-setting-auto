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
    get CollectionSchemaModel () {
        return CollectionSchemaModel;
    },
    get CollectionSchemaSchema () {
        return CollectionSchemaSchema;
    }
});
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CollectionSchemaModel = class CollectionSchemaModel {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        type: _mongoose1.Types.ObjectId,
        ref: 'Database',
        required: true,
        index: true
    }),
    _ts_metadata("design:type", typeof _mongoose1.Types === "undefined" || typeof _mongoose1.Types.ObjectId === "undefined" ? Object : _mongoose1.Types.ObjectId)
], CollectionSchemaModel.prototype, "databaseId", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: _mongoose1.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }),
    _ts_metadata("design:type", typeof _mongoose1.Types === "undefined" || typeof _mongoose1.Types.ObjectId === "undefined" ? Object : _mongoose1.Types.ObjectId)
], CollectionSchemaModel.prototype, "userId", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        index: true
    }),
    _ts_metadata("design:type", String)
], CollectionSchemaModel.prototype, "name", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], CollectionSchemaModel.prototype, "displayName", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], CollectionSchemaModel.prototype, "description", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], CollectionSchemaModel.prototype, "icon", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: Array,
        required: true
    }),
    _ts_metadata("design:type", Array)
], CollectionSchemaModel.prototype, "fields", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], CollectionSchemaModel.prototype, "timestamps", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], CollectionSchemaModel.prototype, "softDelete", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], CollectionSchemaModel.prototype, "enableApi", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], CollectionSchemaModel.prototype, "apiPath", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: Object
    }),
    _ts_metadata("design:type", Object)
], CollectionSchemaModel.prototype, "permissions", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], CollectionSchemaModel.prototype, "createdBy", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], CollectionSchemaModel.prototype, "updatedBy", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 1
    }),
    _ts_metadata("design:type", Number)
], CollectionSchemaModel.prototype, "version", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], CollectionSchemaModel.prototype, "dataCount", void 0);
CollectionSchemaModel = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true,
        collection: 'collection_schemas'
    })
], CollectionSchemaModel);
const CollectionSchemaSchema = _mongoose.SchemaFactory.createForClass(CollectionSchemaModel);
// Index cho search và performance
CollectionSchemaSchema.index({
    userId: 1,
    databaseId: 1
});
CollectionSchemaSchema.index({
    databaseId: 1,
    name: 1
}, {
    unique: true
}); // Trong 1 DB không có 2 collection cùng tên
CollectionSchemaSchema.index({
    userId: 1,
    name: 1
});
CollectionSchemaSchema.index({
    createdBy: 1
});

//# sourceMappingURL=collection-schema.schema.js.map