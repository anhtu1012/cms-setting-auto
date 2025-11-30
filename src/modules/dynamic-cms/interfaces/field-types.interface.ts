/**
 * Các kiểu dữ liệu field được hỗ trợ
 */
export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATETIME = 'datetime',
  EMAIL = 'email',
  URL = 'url',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  FILE = 'file',
  IMAGE = 'image',
  JSON = 'json',
  RICH_TEXT = 'rich_text',
  REFERENCE = 'reference', // Liên kết đến collection khác
  ARRAY = 'array',
}

/**
 * Cấu hình validation cho field
 */
export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: string[];
  customValidation?: string; // JavaScript code để validate
}

/**
 * Cấu hình cho field type SELECT/MULTI_SELECT
 */
export interface SelectOption {
  label: string;
  value: string | number;
}

/**
 * Cấu hình cho field type REFERENCE
 */
export interface ReferenceConfig {
  collection: string; // Tên collection được tham chiếu
  displayField: string; // Field nào sẽ hiển thị
  multiple?: boolean; // Có cho phép multiple references không
}

/**
 * Định nghĩa một field trong schema
 */
export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  defaultValue?: any;
  validation?: FieldValidation;

  // Cấu hình cho các field type đặc biệt
  options?: SelectOption[]; // Cho SELECT, RADIO, MULTI_SELECT
  referenceConfig?: ReferenceConfig; // Cho REFERENCE

  // UI configuration
  placeholder?: string;
  helpText?: string;
  showInList?: boolean; // Hiển thị trong danh sách hay không
  showInForm?: boolean; // Hiển thị trong form hay không
  sortable?: boolean;
  searchable?: boolean;

  // Field ordering
  order?: number;
}

/**
 * Định nghĩa một collection (table) động
 */
export interface CollectionSchema {
  _id?: string;
  name: string; // Tên collection (slug)
  displayName: string; // Tên hiển thị
  description?: string;
  icon?: string;

  // Fields configuration
  fields: FieldDefinition[];

  // Collection settings
  timestamps?: boolean; // Tự động tạo createdAt, updatedAt
  softDelete?: boolean; // Dùng deletedAt thay vì xóa thật

  // API configuration
  enableApi?: boolean;
  apiPath?: string; // Custom API path

  // Permissions & Access Control
  permissions?: {
    create?: string[]; // Array of role names
    read?: string[];
    update?: string[];
    delete?: string[];
  };

  // Metadata
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
}

/**
 * Document động - dữ liệu thực tế của user
 */
export interface DynamicDocument {
  _id?: string;
  _collection: string; // Tên collection này thuộc về
  _data: Record<string, any>; // Dữ liệu thực tế
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  createdBy?: string;
  updatedBy?: string;
}
