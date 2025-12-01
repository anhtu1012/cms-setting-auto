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
exports.CollectionSchemaSchema = exports.CollectionSchemaModel = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CollectionSchemaModel = class CollectionSchemaModel {
};
exports.CollectionSchemaModel = CollectionSchemaModel;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Database', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CollectionSchemaModel.prototype, "databaseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CollectionSchemaModel.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], CollectionSchemaModel.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CollectionSchemaModel.prototype, "displayName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CollectionSchemaModel.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CollectionSchemaModel.prototype, "icon", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, required: true }),
    __metadata("design:type", Array)
], CollectionSchemaModel.prototype, "fields", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], CollectionSchemaModel.prototype, "timestamps", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], CollectionSchemaModel.prototype, "softDelete", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], CollectionSchemaModel.prototype, "enableApi", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CollectionSchemaModel.prototype, "apiPath", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], CollectionSchemaModel.prototype, "permissions", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CollectionSchemaModel.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CollectionSchemaModel.prototype, "updatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], CollectionSchemaModel.prototype, "version", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CollectionSchemaModel.prototype, "dataCount", void 0);
exports.CollectionSchemaModel = CollectionSchemaModel = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'collection_schemas' })
], CollectionSchemaModel);
exports.CollectionSchemaSchema = mongoose_1.SchemaFactory.createForClass(CollectionSchemaModel);
exports.CollectionSchemaSchema.index({ userId: 1, databaseId: 1 });
exports.CollectionSchemaSchema.index({ databaseId: 1, name: 1 }, { unique: true });
exports.CollectionSchemaSchema.index({ userId: 1, name: 1 });
exports.CollectionSchemaSchema.index({ createdBy: 1 });
//# sourceMappingURL=collection-schema.schema.js.map