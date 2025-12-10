/**
 * API Route Constants
 * Tập trung quản lý tất cả các route paths trong ứng dụng
 */

// API Version prefix
export const API_VERSION = 'v1';

/**
 * Auth routes
 */
export const AUTH_ROUTES = {
  BASE: `${API_VERSION}/auth`,
  LOGIN: 'login',
  REGISTER: 'register',
  LOGOUT: 'logout',
  REFRESH: 'refresh',
} as const;

/**
 * User routes
 */
export const USER_ROUTES = {
  BASE: `${API_VERSION}/users`,
  PROFILE: 'profile',
  BY_ID: ':id',
} as const;

/**
 * Database routes
 */
export const DATABASE_ROUTES = {
  BASE: `${API_VERSION}/databases`,
  BY_ID: ':id',
  PERMANENT_DELETE: ':id/permanent',
} as const;

/**
 * Collection Schema routes
 */
export const COLLECTION_SCHEMA_ROUTES = {
  BASE: `${API_VERSION}/collection-schemas`,
  BY_DATABASE: ':databaseId',
  BY_NAME: ':databaseId/:collectionName',
} as const;

/**
 * Dynamic Data routes
 */
export const DYNAMIC_DATA_ROUTES = {
  BASE: `${API_VERSION}/:databaseId/:collectionName`,
  // Sub-routes (chỉ dùng trong decorator, không có prefix BASE)
  BULK: 'bulk',
  REPLACE_ALL: 'replace-all',
  QUERY: 'query',
  COUNT: 'count',
  BY_ID: ':id',
  HARD_DELETE: ':id/hard',
  RESTORE: ':id/restore',
} as const;

/**
 * Tier routes
 */
export const TIER_ROUTES = {
  BASE: `${API_VERSION}/tier`,
  INFO: 'info',
  CHECK_DATABASE_LIMIT: 'check-database-limit',
  CHECK_DATA_LIMIT: 'check-data-limit/:databaseId/:collectionName',
  USAGE: 'usage',
  USAGE_BY_DATABASE: 'usage/:databaseId',
  UPGRADE: 'upgrade',
} as const;

/**
 * Route Patterns for Guards
 * Các pattern dùng để kiểm tra route trong guards
 */
export const ROUTE_PATTERNS = {
  // Database creation
  DATABASE_CREATE: `/${DATABASE_ROUTES.BASE}`,

  // Data creation patterns
  DATA_CREATE: '/:databaseId/:collectionName',
  DATA_BULK_CREATE: '/:databaseId/:collectionName/bulk',
  DATA_REPLACE_ALL: '/:databaseId/:collectionName/replace-all',

  // With version prefix
  DATA_CREATE_V1: `/${API_VERSION}/:databaseId/:collectionName`,
  DATA_BULK_CREATE_V1: `/${API_VERSION}/:databaseId/:collectionName/bulk`,
  DATA_REPLACE_ALL_V1: `/${API_VERSION}/:databaseId/:collectionName/replace-all`,
} as const;

/**
 * Helper function to build full route path
 */
export const buildRoute = (base: string, ...paths: string[]): string => {
  return `/${base}/${paths.join('/')}`.replace(/\/+/g, '/');
};

/**
 * Helper function to check if path matches pattern
 */
export const matchesRoute = (path: string, pattern: string): boolean => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedPath === pattern || normalizedPath.includes(pattern);
};
