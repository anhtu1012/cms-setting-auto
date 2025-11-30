import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator để lấy databaseId từ header 'x-database-id'
 * Sử dụng: @DatabaseId() databaseId: string
 */
export const DatabaseId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const databaseId = request.headers['x-database-id'];

    if (!databaseId) {
      throw new Error('Database ID is required in header x-database-id');
    }

    return databaseId;
  },
);
