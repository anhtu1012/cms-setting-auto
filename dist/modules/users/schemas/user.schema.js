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
    get User () {
        return User;
    },
    get UserSchema () {
        return UserSchema;
    }
});
const _mongoose = require("@nestjs/mongoose");
const _tierenum = require("../../../common/enums/tier.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let User = class User {
};
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        unique: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "email", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true,
        unique: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "userName", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "password", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "firstName", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        required: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "lastName", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 'user',
        enum: [
            'admin',
            'user',
            'editor'
        ]
    }),
    _ts_metadata("design:type", String)
], User.prototype, "role", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", String)
], User.prototype, "avatar", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], User.prototype, "lastLogin", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: String,
        enum: Object.values(_tierenum.AccountTier),
        default: _tierenum.AccountTier.FREE
    }),
    _ts_metadata("design:type", typeof _tierenum.AccountTier === "undefined" ? Object : _tierenum.AccountTier)
], User.prototype, "tier", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], User.prototype, "tierStartDate", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], User.prototype, "tierExpiryDate", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: [
            {
                tier: String,
                startDate: Date,
                endDate: Date,
                upgradeReason: String
            }
        ],
        default: []
    }),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], User.prototype, "tierHistory", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], User.prototype, "currentDatabaseCount", void 0);
_ts_decorate([
    (0, _mongoose.Prop)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], User.prototype, "lastApiCallReset", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], User.prototype, "apiCallsToday", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], User.prototype, "points", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        default: 0
    }),
    _ts_metadata("design:type", Number)
], User.prototype, "walletBalance", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: [
            {
                date: Date,
                amount: Number,
                type: String,
                description: String
            }
        ],
        default: []
    }),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], User.prototype, "walletTransactions", void 0);
_ts_decorate([
    (0, _mongoose.Prop)({
        type: [
            {
                date: Date,
                points: Number,
                reason: String
            }
        ],
        default: []
    }),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], User.prototype, "pointsHistory", void 0);
User = _ts_decorate([
    (0, _mongoose.Schema)({
        timestamps: true
    })
], User);
const UserSchema = _mongoose.SchemaFactory.createForClass(User);

//# sourceMappingURL=user.schema.js.map