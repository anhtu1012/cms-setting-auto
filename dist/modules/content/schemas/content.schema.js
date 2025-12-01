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
    get Content () {
        return Content;
    },
    get ContentSchema () {
        return ContentSchema;
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
let Content = class Content {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], Content.prototype, "title", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], Content.prototype, "slug", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        type: Object
    }),
    _ts_metadata("design:type", Object)
], Content.prototype, "body", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 'draft',
        enum: [
            'draft',
            'published',
            'archived'
        ]
    }),
    _ts_metadata("design:type", String)
], Content.prototype, "status", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: _mongoose1.Types.ObjectId,
        ref: 'User',
        required: true
    }),
    _ts_metadata("design:type", typeof _mongoose1.Types === "undefined" || typeof _mongoose1.Types.ObjectId === "undefined" ? Object : _mongoose1.Types.ObjectId)
], Content.prototype, "author", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: [
            String
        ],
        default: []
    }),
    _ts_metadata("design:type", Array)
], Content.prototype, "tags", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Content.prototype, "excerpt", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], Content.prototype, "featuredImage", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Content.prototype, "publishedAt", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Content.prototype, "viewCount", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: Object,
        default: {}
    }),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], Content.prototype, "metadata", void 0);
Content = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true
    })
], Content);
const ContentSchema = _mongoose.SchemaFactory.createForClass(Content);

//# sourceMappingURL=content.schema.js.map