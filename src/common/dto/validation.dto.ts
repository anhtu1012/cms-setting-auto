/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation response interface
 */
export interface ValidationResponse {
  valid: boolean;
  errors?: ValidationError[];
}

/**
 * Helper function to create validation error
 */
export function createValidationError(
  field: string,
  message: string,
): ValidationError {
  return { field, message };
}

/**
 * Helper function to create validation response
 */
export function createValidationResponse(
  errors: ValidationError[] = [],
): ValidationResponse {
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
