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
    get isValidObjectId () {
        return isValidObjectId;
    },
    get toObjectId () {
        return toObjectId;
    },
    get validateObjectId () {
        return validateObjectId;
    },
    get validateObjectIds () {
        return validateObjectIds;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("mongoose");
function validateObjectId(id, fieldName = 'id') {
    if (!_mongoose.Types.ObjectId.isValid(id)) {
        throw new _common.BadRequestException(`Invalid ${fieldName} format: "${id}". Must be a 24 character hex string.`);
    }
}
function validateObjectIds(ids) {
    for (const [fieldName, id] of Object.entries(ids)){
        validateObjectId(id, fieldName);
    }
}
function toObjectId(id, fieldName = 'id') {
    validateObjectId(id, fieldName);
    return new _mongoose.Types.ObjectId(id);
}
function isValidObjectId(id) {
    return _mongoose.Types.ObjectId.isValid(id);
}

//# sourceMappingURL=validation.utils.js.map