"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _default = ()=>({
        database: {
            uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cms-setting-auto'
        },
        port: parseInt(process.env.PORT || '3000', 10)
    });

//# sourceMappingURL=database.config.js.map