"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DatabaseId", {
    enumerable: true,
    get: function() {
        return DatabaseId;
    }
});
const _common = require("@nestjs/common");
const DatabaseId = (0, _common.createParamDecorator)((data, ctx)=>{
    const request = ctx.switchToHttp().getRequest();
    const databaseId = request.headers['x-database-id'];
    if (!databaseId) {
        throw new Error('Database ID is required in header x-database-id');
    }
    return databaseId;
});

//# sourceMappingURL=database-id.decorator.js.map