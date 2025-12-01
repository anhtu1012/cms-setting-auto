"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidationError = createValidationError;
exports.createValidationResponse = createValidationResponse;
function createValidationError(field, message) {
    return { field, message };
}
function createValidationResponse(errors = []) {
    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
    };
}
//# sourceMappingURL=validation.dto.js.map