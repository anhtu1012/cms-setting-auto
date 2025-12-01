import { FieldType } from '../interfaces/field-types.interface';
export declare class FieldValidationDto {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: string[];
}
export declare class SelectOptionDto {
    label: string;
    value: string;
}
export declare class ReferenceConfigDto {
    collection: string;
    displayField: string;
    multiple?: boolean;
}
export declare class FieldDefinitionDto {
    name: string;
    type: FieldType;
    label: string;
    description?: string;
    defaultValue?: any;
    validation?: FieldValidationDto;
    options?: SelectOptionDto[];
    referenceConfig?: ReferenceConfigDto;
    placeholder?: string;
    helpText?: string;
    showInList?: boolean;
    showInForm?: boolean;
    sortable?: boolean;
    searchable?: boolean;
    order?: number;
}
export declare class CreateCollectionSchemaDto {
    databaseId: string;
    name: string;
    displayName: string;
    description?: string;
    icon?: string;
    fields: FieldDefinitionDto[];
    timestamps?: boolean;
    softDelete?: boolean;
    enableApi?: boolean;
    apiPath?: string;
    permissions?: {
        create?: string[];
        read?: string[];
        update?: string[];
        delete?: string[];
    };
}
export declare class UpdateCollectionSchemaDto {
    displayName?: string;
    description?: string;
    icon?: string;
    fields?: FieldDefinitionDto[];
    timestamps?: boolean;
    softDelete?: boolean;
    enableApi?: boolean;
    apiPath?: string;
    permissions?: {
        create?: string[];
        read?: string[];
        update?: string[];
        delete?: string[];
    };
}
