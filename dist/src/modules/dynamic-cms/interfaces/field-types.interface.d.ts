export declare enum FieldType {
    TEXT = "text",
    TEXTAREA = "textarea",
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean",
    DATE = "date",
    DATETIME = "datetime",
    EMAIL = "email",
    URL = "url",
    SELECT = "select",
    MULTI_SELECT = "multi_select",
    RADIO = "radio",
    CHECKBOX = "checkbox",
    FILE = "file",
    IMAGE = "image",
    JSON = "json",
    RICH_TEXT = "rich_text",
    REFERENCE = "reference",
    ARRAY = "array"
}
export interface FieldValidation {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: string[];
    customValidation?: string;
}
export interface SelectOption {
    label: string;
    value: string | number;
}
export interface ReferenceConfig {
    collection: string;
    displayField: string;
    multiple?: boolean;
}
export interface FieldDefinition {
    name: string;
    label: string;
    type: FieldType;
    description?: string;
    defaultValue?: any;
    validation?: FieldValidation;
    options?: SelectOption[];
    referenceConfig?: ReferenceConfig;
    placeholder?: string;
    helpText?: string;
    showInList?: boolean;
    showInForm?: boolean;
    sortable?: boolean;
    searchable?: boolean;
    order?: number;
}
export interface CollectionSchema {
    _id?: string;
    name: string;
    displayName: string;
    description?: string;
    icon?: string;
    fields: FieldDefinition[];
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
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
    version?: number;
}
export interface DynamicDocument {
    _id?: string;
    _collection: string;
    _data: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    createdBy?: string;
    updatedBy?: string;
}
