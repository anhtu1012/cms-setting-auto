"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicDataSchema = exports.DynamicData = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DynamicData = class DynamicData {
};
exports.DynamicData = DynamicData;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: false, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DynamicData.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Database', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DynamicData.prototype, "databaseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], DynamicData.prototype, "_collection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], DynamicData.prototype, "_data", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], DynamicData.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DynamicData.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DynamicData.prototype, "updatedBy", void 0);
exports.DynamicData = DynamicData = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'dynamic_data' })
], DynamicData);
exports.DynamicDataSchema = mongoose_1.SchemaFactory.createForClass(DynamicData);
exports.DynamicDataSchema.index({ userId: 1, databaseId: 1, _collection: 1 });
exports.DynamicDataSchema.index({ userId: 1, _collection: 1, deletedAt: 1 });
exports.DynamicDataSchema.index({ databaseId: 1, _collection: 1, deletedAt: 1 });
exports.DynamicDataSchema.index({ _collection: 1, createdAt: -1 });
exports.DynamicDataSchema.index({ createdBy: 1 });
exports.DynamicDataSchema.index({ userId: 1, createdAt: -1 });
exports.DynamicDataSchema.virtual('data').get(function () {
    return this._data;
});
//# sourceMappingURL=dynamic-data.schema.js.map