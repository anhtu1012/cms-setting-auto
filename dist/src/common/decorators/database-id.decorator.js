"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseId = void 0;
const common_1 = require("@nestjs/common");
exports.DatabaseId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const databaseId = request.headers['x-database-id'];
    if (!databaseId) {
        throw new Error('Database ID is required in header x-database-id');
    }
    return databaseId;
});
//# sourceMappingURL=database-id.decorator.js.map