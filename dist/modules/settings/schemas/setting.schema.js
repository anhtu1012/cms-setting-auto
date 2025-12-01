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
    get Setting () {
        return Setting;
    },
    get SettingSchema () {
        return SettingSchema;
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
let Setting = class Setting {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        unique: true
    }),
    _ts_metadata("design:type", String)
], Setting.prototype, "key", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        type: Object
    }),
    _ts_metadata("design:type", Object)
], Setting.prototype, "value", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Setting.prototype, "description", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 'general',
        enum: [
            'general',
            'appearance',
            'security',
            'notification',
            'integration'
        ]
    }),
    _ts_metadata("design:type", String)
], Setting.prototype, "category", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], Setting.prototype, "isPublic", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], Setting.prototype, "isSystem", void 0);
Setting = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true
    })
], Setting);
const SettingSchema = _mongoose.SchemaFactory.createForClass(Setting);

//# sourceMappingURL=setting.schema.js.map