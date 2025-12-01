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
    get DynamicData () {
        return DynamicData;
    },
    get DynamicDataSchema () {
        return DynamicDataSchema;
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
let DynamicData = class DynamicData {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        type: _mongoose1.Types.ObjectId,
        ref: 'User',
        required: false,
        index: true
    }),
    _ts_metadata("design:type", typeof _mongoose1.Types === "undefined" || typeof _mongoose1.Types.ObjectId === "undefined" ? Object : _mongoose1.Types.ObjectId)
], DynamicData.prototype, "userId", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: _mongoose1.Types.ObjectId,
        ref: 'Database',
        required: true,
        index: true
    }),
    _ts_metadata("design:type", typeof _mongoose1.Types === "undefined" || typeof _mongoose1.Types.ObjectId === "undefined" ? Object : _mongoose1.Types.ObjectId)
], DynamicData.prototype, "databaseId", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        index: true
    }),
    _ts_metadata("design:type", String)
], DynamicData.prototype, "_collection", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: Object,
        required: true
    }),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], DynamicData.prototype, "_data", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: null
    }),
    _ts_metadata("design:type", Object)
], DynamicData.prototype, "deletedAt", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], DynamicData.prototype, "createdBy", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], DynamicData.prototype, "updatedBy", void 0);
DynamicData = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true,
        collection: 'dynamic_data'
    })
], DynamicData);
const DynamicDataSchema = _mongoose.SchemaFactory.createForClass(DynamicData);
// Indexes để query nhanh
DynamicDataSchema.index({
    userId: 1,
    databaseId: 1,
    _collection: 1
});
DynamicDataSchema.index({
    userId: 1,
    _collection: 1,
    deletedAt: 1
});
DynamicDataSchema.index({
    databaseId: 1,
    _collection: 1,
    deletedAt: 1
});
DynamicDataSchema.index({
    _collection: 1,
    createdAt: -1
});
DynamicDataSchema.index({
    createdBy: 1
});
DynamicDataSchema.index({
    userId: 1,
    createdAt: -1
});
// Virtual để access data dễ hơn
DynamicDataSchema.virtual('data').get(function() {
    return this._data;
});

//# sourceMappingURL=dynamic-data.schema.js.map