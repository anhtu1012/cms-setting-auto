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
    get BlacklistedToken () {
        return BlacklistedToken;
    },
    get BlacklistedTokenSchema () {
        return BlacklistedTokenSchema;
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
let BlacklistedToken = class BlacklistedToken {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        unique: true
    }),
    _ts_metadata("design:type", String)
], BlacklistedToken.prototype, "token", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], BlacklistedToken.prototype, "expiresAt", void 0);
BlacklistedToken = _ts_decorate([
    (0, _mongoose.Schema)()
], BlacklistedToken);
const BlacklistedTokenSchema = _mongoose.SchemaFactory.createForClass(BlacklistedToken);
// TTL index: automatically remove expired tokens
BlacklistedTokenSchema.index({
    expiresAt: 1
}, {
    expireAfterSeconds: 0
});

//# sourceMappingURL=blacklisted-token.schema.js.map