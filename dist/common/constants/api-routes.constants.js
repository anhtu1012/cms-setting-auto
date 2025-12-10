/**
 * API Route Constants
 * Tập trung quản lý tất cả các route paths trong ứng dụng
 */ // API Version prefix
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
    get API_VERSION () {
        return API_VERSION;
    },
    get AUTH_ROUTES () {
        return AUTH_ROUTES;
    },
    get COLLECTION_SCHEMA_ROUTES () {
        return COLLECTION_SCHEMA_ROUTES;
    },
    get DATABASE_ROUTES () {
        return DATABASE_ROUTES;
    },
    get DYNAMIC_DATA_ROUTES () {
        return DYNAMIC_DATA_ROUTES;
    },
    get ROUTE_PATTERNS () {
        return ROUTE_PATTERNS;
    },
    get TIER_ROUTES () {
        return TIER_ROUTES;
    },
    get USER_ROUTES () {
        return USER_ROUTES;
    },
    get buildRoute () {
        return buildRoute;
    },
    get matchesRoute () {
        return matchesRoute;
    }
});
const API_VERSION = 'v1';
const AUTH_ROUTES = {
    BASE: `${API_VERSION}/auth`,
    LOGIN: 'login',
    REGISTER: 'register',
    LOGOUT: 'logout',
    REFRESH: 'refresh'
};
const USER_ROUTES = {
    BASE: `${API_VERSION}/users`,
    PROFILE: 'profile',
    BY_ID: ':id'
};
const DATABASE_ROUTES = {
    BASE: `${API_VERSION}/databases`,
    BY_ID: ':id',
    PERMANENT_DELETE: ':id/permanent'
};
const COLLECTION_SCHEMA_ROUTES = {
    BASE: `${API_VERSION}/collection-schemas`,
    BY_DATABASE: ':databaseId',
    BY_NAME: ':databaseId/:collectionName'
};
const DYNAMIC_DATA_ROUTES = {
    BASE: `${API_VERSION}/:databaseId/:collectionName`,
    // Sub-routes (chỉ dùng trong decorator, không có prefix BASE)
    BULK: 'bulk',
    REPLACE_ALL: 'replace-all',
    QUERY: 'query',
    COUNT: 'count',
    BY_ID: ':id',
    HARD_DELETE: ':id/hard',
    RESTORE: ':id/restore'
};
const TIER_ROUTES = {
    BASE: `${API_VERSION}/tier`,
    INFO: 'info',
    CHECK_DATABASE_LIMIT: 'check-database-limit',
    CHECK_DATA_LIMIT: 'check-data-limit/:databaseId/:collectionName',
    USAGE: 'usage',
    USAGE_BY_DATABASE: 'usage/:databaseId',
    UPGRADE: 'upgrade'
};
const ROUTE_PATTERNS = {
    // Database creation
    DATABASE_CREATE: `/${DATABASE_ROUTES.BASE}`,
    // Data creation patterns
    DATA_CREATE: '/:databaseId/:collectionName',
    DATA_BULK_CREATE: '/:databaseId/:collectionName/bulk',
    DATA_REPLACE_ALL: '/:databaseId/:collectionName/replace-all',
    // With version prefix
    DATA_CREATE_V1: `/${API_VERSION}/:databaseId/:collectionName`,
    DATA_BULK_CREATE_V1: `/${API_VERSION}/:databaseId/:collectionName/bulk`,
    DATA_REPLACE_ALL_V1: `/${API_VERSION}/:databaseId/:collectionName/replace-all`
};
const buildRoute = (base, ...paths)=>{
    return `/${base}/${paths.join('/')}`.replace(/\/+/g, '/');
};
const matchesRoute = (path, pattern)=>{
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return normalizedPath === pattern || normalizedPath.includes(pattern);
};

//# sourceMappingURL=api-routes.constants.js.map