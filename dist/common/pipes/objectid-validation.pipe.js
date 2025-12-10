"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectIdValidationPipe", {
    enumerable: true,
    get: function() {
        return ObjectIdValidationPipe;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("mongoose");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ObjectIdValidationPipe = class ObjectIdValidationPipe {
    transform(value, metadata) {
        // Chỉ validate nếu metadata.data là 'databaseId' hoặc 'id'
        const shouldValidate = metadata.type === 'param' && (metadata.data === 'databaseId' || metadata.data === 'id');
        if (shouldValidate) {
            if (!_mongoose.Types.ObjectId.isValid(value)) {
                throw new _common.BadRequestException(`Invalid ${metadata.data} format: "${value}". Must be a 24 character hex string.`);
            }
        }
        return value;
    }
};
ObjectIdValidationPipe = _ts_decorate([
    (0, _common.Injectable)()
], ObjectIdValidationPipe);

//# sourceMappingURL=objectid-validation.pipe.js.map