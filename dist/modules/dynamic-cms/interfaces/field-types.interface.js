/**
 * Các kiểu dữ liệu field được hỗ trợ
 */ "use strict";
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
    get FieldType () {
        return FieldType;
    },
    get RelationType () {
        return RelationType;
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
var RelationType = /*#__PURE__*/ function(RelationType) {
    RelationType["ONE_TO_ONE"] = "one_to_one";
    RelationType["ONE_TO_MANY"] = "one_to_many";
    RelationType["MANY_TO_ONE"] = "many_to_one";
    RelationType["MANY_TO_MANY"] = "many_to_many";
    return RelationType;
}({});

//# sourceMappingURL=field-types.interface.js.map