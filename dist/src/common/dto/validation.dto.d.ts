export interface ValidationError {
    field: string;
    message: string;
}
export interface ValidationResponse {
    valid: boolean;
    errors?: ValidationError[];
}
export declare function createValidationError(field: string, message: string): ValidationError;
export declare function createValidationResponse(errors?: ValidationError[]): ValidationResponse;
