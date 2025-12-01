/**
 * Validation error interface
 */ "use strict";
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
    get createValidationError () {
        return createValidationError;
    },
    get createValidationResponse () {
        return createValidationResponse;
    }
});
function createValidationError(field, message) {
    return {
        field,
        message
    };
}
function createValidationResponse(errors = []) {
    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
    };
}

//# sourceMappingURL=validation.dto.js.map