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
    get Database () {
        return Database;
    },
    get DatabaseSchema () {
        return DatabaseSchema;
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
let Database = class Database {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        index: true
    }),
    _ts_metadata("design:type", String)
], Database.prototype, "name", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], Database.prototype, "displayName", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Database.prototype, "description", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: _mongoose1.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }),
    _ts_metadata("design:type", typeof _mongoose1.Types === "undefined" || typeof _mongoose1.Types.ObjectId === "undefined" ? Object : _mongoose1.Types.ObjectId)
], Database.prototype, "userId", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], Database.prototype, "isActive", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Database.prototype, "icon", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: Object
    }),
    _ts_metadata("design:type", Object)
], Database.prototype, "settings", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: [
            String
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], Database.prototype, "tags", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Database.prototype, "collectionsCount", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Database.prototype, "dataCount", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Database.prototype, "createdBy", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Database.prototype, "updatedBy", void 0);
Database = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true,
        collection: 'databases'
    })
], Database);
const DatabaseSchema = _mongoose.SchemaFactory.createForClass(Database);
// Indexes
DatabaseSchema.index({
    userId: 1,
    name: 1
}, {
    unique: true
}); // User không được tạo 2 db cùng tên
DatabaseSchema.index({
    userId: 1,
    isActive: 1
});
DatabaseSchema.index({
    createdAt: -1
});

//# sourceMappingURL=database.schema.js.map