import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param id - The string to validate
 * @param fieldName - Name of the field for error message (default: 'id')
 * @throws BadRequestException if invalid
 */
export function validateObjectId(id: string, fieldName: string = 'id'): void {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException(
      `Invalid ${fieldName} format: "${id}". Must be a 24 character hex string.`,
    );
  }
}

/**
 * Validates multiple ObjectIds at once
 * @param ids - Object with fieldName as key and id as value
 * @throws BadRequestException if any invalid
 */
export function validateObjectIds(ids: Record<string, string>): void {
  for (const [fieldName, id] of Object.entries(ids)) {
    validateObjectId(id, fieldName);
  }
}

/**
 * Safely converts a string to ObjectId after validation
 * @param id - The string to convert
 * @param fieldName - Name of the field for error message
 * @returns Types.ObjectId
 */
export function toObjectId(
  id: string,
  fieldName: string = 'id',
): Types.ObjectId {
  validateObjectId(id, fieldName);
  return new Types.ObjectId(id);
}

/**
 * Checks if a string is a valid ObjectId without throwing
 * @param id - The string to check
 * @returns boolean
 */
export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}
