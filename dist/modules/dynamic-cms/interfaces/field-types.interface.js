/**
 * Các kiểu dữ liệu field được hỗ trợ
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FieldType", {
    enumerable: true,
    get: function() {
        return FieldType;
    }
});
var FieldType = /*#__PURE__*/ function(FieldType) {
    FieldType["TEXT"] = "text";
    FieldType["TEXTAREA"] = "textarea";
    FieldType["STRING"] = "string";
    FieldType["NUMBER"] = "number";
    FieldType["BOOLEAN"] = "boolean";
    FieldType["DATE"] = "date";
    FieldType["DATETIME"] = "datetime";
    FieldType["EMAIL"] = "email";
    FieldType["URL"] = "url";
    FieldType["SELECT"] = "select";
    FieldType["MULTI_SELECT"] = "multi_select";
    FieldType["RADIO"] = "radio";
    FieldType["CHECKBOX"] = "checkbox";
    FieldType["FILE"] = "file";
    FieldType["IMAGE"] = "image";
    FieldType["JSON"] = "json";
    FieldType["RICH_TEXT"] = "rich_text";
    FieldType["REFERENCE"] = "reference";
    FieldType["ARRAY"] = "array";
    return FieldType;
}({});

//# sourceMappingURL=field-types.interface.js.map