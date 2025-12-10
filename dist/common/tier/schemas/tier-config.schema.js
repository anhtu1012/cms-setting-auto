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
    get TierConfig () {
        return TierConfig;
    },
    get TierConfigSchema () {
        return TierConfigSchema;
    }
});
const _mongoose = require("@nestjs/mongoose");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TierConfig = class TierConfig {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        unique: true,
        index: true
    }),
    _ts_metadata("design:type", String)
], TierConfig.prototype, "tierCode", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], TierConfig.prototype, "tierName", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], TierConfig.prototype, "description", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", Number)
], TierConfig.prototype, "maxDatabases", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", Number)
], TierConfig.prototype, "maxDataPerCollection", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", Number)
], TierConfig.prototype, "maxCollectionsPerDatabase", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", Number)
], TierConfig.prototype, "maxStorageGB", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", Number)
], TierConfig.prototype, "maxApiCallsPerDay", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], TierConfig.prototype, "price", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 'USD'
    }),
    _ts_metadata("design:type", String)
], TierConfig.prototype, "currency", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], TierConfig.prototype, "isActive", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], TierConfig.prototype, "displayOrder", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: Object
    }),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], TierConfig.prototype, "metadata", void 0);
TierConfig = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true
    })
], TierConfig);
const TierConfigSchema = _mongoose.SchemaFactory.createForClass(TierConfig);
// Index để tìm kiếm nhanh
TierConfigSchema.index({
    isActive: 1,
    displayOrder: 1
});

//# sourceMappingURL=tier-config.schema.js.map