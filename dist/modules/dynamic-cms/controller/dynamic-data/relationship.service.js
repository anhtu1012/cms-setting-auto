"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RelationshipService", {
    enumerable: true,
    get: function() {
        return RelationshipService;
    }
});
const _common = require("@nestjs/common");
const _mongoose = require("@nestjs/mongoose");
const _mongoose1 = require("mongoose");
const _dynamicdataschema = require("../../schemas/dynamic-data.schema");
const _collectionschemaservice = require("../collection-schema/collection-schema.service");
const _fieldtypesinterface = require("../../interfaces/field-types.interface");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let RelationshipService = class RelationshipService {
    /**
   * Populate references trong document
   */ async populateDocument(collectionName, databaseId, document, depth = 1, visitedCollections = new Set()) {
        if (depth <= 0) return document;
        if (visitedCollections.has(collectionName)) return document; // Tránh circular reference
        visitedCollections.add(collectionName);
        const schema = await this.collectionSchemaService.findByNamePublic(collectionName, databaseId);
        if (!schema) return document;
        const plainDoc = document.toObject ? document.toObject() : document;
        const { _data, ...rest } = plainDoc;
        const populatedData = {
            ..._data
        };
        // Tìm các field có type REFERENCE
        const referenceFields = schema.fields.filter((field)=>field.type === _fieldtypesinterface.FieldType.REFERENCE && field.referenceConfig);
        for (const field of referenceFields){
            const refConfig = field.referenceConfig;
            const fieldValue = _data[field.name];
            if (!fieldValue) continue;
            // Kiểm tra autoPopulate
            if (refConfig.autoPopulate === false) continue;
            try {
                if (refConfig.multiple && Array.isArray(fieldValue)) {
                    // Multiple references
                    const populated = await this.populateMultipleReferences(refConfig.collection, databaseId, fieldValue, refConfig.populateFields, depth - 1, new Set(visitedCollections));
                    populatedData[field.name] = populated;
                } else if (!Array.isArray(fieldValue)) {
                    // Single reference
                    const populated = await this.populateSingleReference(refConfig.collection, databaseId, fieldValue, refConfig.populateFields, depth - 1, new Set(visitedCollections));
                    populatedData[field.name] = populated;
                }
            } catch (error) {
                console.error(`Error populating field ${field.name}:`, error.message);
            // Giữ nguyên giá trị gốc nếu populate lỗi
            }
        }
        return {
            ...rest,
            ...populatedData
        };
    }
    /**
   * Populate multiple documents
   */ async populateDocuments(collectionName, databaseId, documents, depth = 1) {
        const visitedCollections = new Set();
        return Promise.all(documents.map((doc)=>this.populateDocument(collectionName, databaseId, doc, depth, new Set(visitedCollections))));
    }
    /**
   * Populate single reference
   */ async populateSingleReference(collectionName, databaseId, refId, fields, depth = 0, visitedCollections = new Set()) {
        try {
            const objectId = new _mongoose1.Types.ObjectId(refId);
            const doc = await this.dynamicDataModel.findOne({
                _id: objectId,
                _collection: collectionName,
                databaseId: new _mongoose1.Types.ObjectId(databaseId),
                deletedAt: null
            });
            if (!doc) return null;
            // Nếu có chỉ định fields cụ thể
            let result;
            if (fields && fields.length > 0) {
                result = {
                    _id: doc._id
                };
                fields.forEach((field)=>{
                    if (doc._data[field] !== undefined) {
                        result[field] = doc._data[field];
                    }
                });
            } else {
                result = doc.toObject();
                const { _data, ...rest } = result;
                result = {
                    ...rest,
                    ..._data
                };
            }
            // Populate nested references nếu depth > 0
            if (depth > 0) {
                return this.populateDocument(collectionName, databaseId, result, depth, visitedCollections);
            }
            return result;
        } catch (error) {
            console.error('Error populating single reference:', error.message);
            return null;
        }
    }
    /**
   * Populate multiple references
   */ async populateMultipleReferences(collectionName, databaseId, refIds, fields, depth = 0, visitedCollections = new Set()) {
        try {
            const objectIds = refIds.filter((id)=>_mongoose1.Types.ObjectId.isValid(id)).map((id)=>new _mongoose1.Types.ObjectId(id));
            if (objectIds.length === 0) return [];
            const docs = await this.dynamicDataModel.find({
                _id: {
                    $in: objectIds
                },
                _collection: collectionName,
                databaseId: new _mongoose1.Types.ObjectId(databaseId),
                deletedAt: null
            });
            // Transform và filter fields
            let results = docs.map((doc)=>{
                if (fields && fields.length > 0) {
                    const result = {
                        _id: doc._id
                    };
                    fields.forEach((field)=>{
                        if (doc._data[field] !== undefined) {
                            result[field] = doc._data[field];
                        }
                    });
                    return result;
                } else {
                    const plainDoc = doc.toObject();
                    const { _data, ...rest } = plainDoc;
                    return {
                        ...rest,
                        ..._data
                    };
                }
            });
            // Populate nested references nếu depth > 0
            if (depth > 0) {
                results = await Promise.all(results.map((result)=>this.populateDocument(collectionName, databaseId, result, depth, visitedCollections)));
            }
            return results;
        } catch (error) {
            console.error('Error populating multiple references:', error.message);
            return [];
        }
    }
    /**
   * Validate reference ID exists
   */ async validateReference(collectionName, databaseId, refId) {
        try {
            const objectId = new _mongoose1.Types.ObjectId(refId);
            const exists = await this.dynamicDataModel.exists({
                _id: objectId,
                _collection: collectionName,
                databaseId: new _mongoose1.Types.ObjectId(databaseId),
                deletedAt: null
            });
            return !!exists;
        } catch (error) {
            return false;
        }
    }
    /**
   * Validate multiple references
   */ async validateReferences(collectionName, databaseId, refIds) {
        const invalidIds = [];
        for (const refId of refIds){
            const isValid = await this.validateReference(collectionName, databaseId, refId);
            if (!isValid) {
                invalidIds.push(refId);
            }
        }
        return {
            valid: invalidIds.length === 0,
            invalidIds
        };
    }
    /**
   * Get inverse relationships (tìm tất cả documents reference đến document này)
   */ async getInverseRelations(collectionName, databaseId, documentId, inverseCollectionName, inverseFieldName) {
        try {
            const docs = await this.dynamicDataModel.find({
                _collection: inverseCollectionName,
                databaseId: new _mongoose1.Types.ObjectId(databaseId),
                [`_data.${inverseFieldName}`]: documentId,
                deletedAt: null
            });
            return docs.map((doc)=>{
                const plainDoc = doc.toObject();
                const { _data, ...rest } = plainDoc;
                return {
                    ...rest,
                    ..._data
                };
            });
        } catch (error) {
            console.error('Error getting inverse relations:', error.message);
            return [];
        }
    }
    /**
   * Cascade delete references khi xóa document
   */ async cascadeDelete(collectionName, databaseId, documentId) {
        const schema = await this.collectionSchemaService.findByNamePublic(collectionName, databaseId);
        if (!schema) return;
        // Tìm các field có cascadeDelete = true
        const cascadeFields = schema.fields.filter((field)=>field.type === _fieldtypesinterface.FieldType.REFERENCE && field.referenceConfig?.cascadeDelete);
        for (const field of cascadeFields){
            const refConfig = field.referenceConfig;
            const doc = await this.dynamicDataModel.findOne({
                _id: new _mongoose1.Types.ObjectId(documentId),
                _collection: collectionName,
                databaseId: new _mongoose1.Types.ObjectId(databaseId)
            });
            if (!doc) continue;
            const refValue = doc._data[field.name];
            if (!refValue) continue;
            try {
                if (refConfig.multiple && Array.isArray(refValue)) {
                    // Xóa multiple references
                    await this.dynamicDataModel.deleteMany({
                        _id: {
                            $in: refValue.map((id)=>new _mongoose1.Types.ObjectId(id))
                        },
                        _collection: refConfig.collection,
                        databaseId: new _mongoose1.Types.ObjectId(databaseId)
                    });
                } else if (!Array.isArray(refValue)) {
                    // Xóa single reference
                    await this.dynamicDataModel.deleteOne({
                        _id: new _mongoose1.Types.ObjectId(refValue),
                        _collection: refConfig.collection,
                        databaseId: new _mongoose1.Types.ObjectId(databaseId)
                    });
                }
            } catch (error) {
                console.error(`Error cascade deleting field ${field.name}:`, error.message);
            }
        }
    }
    constructor(dynamicDataModel, collectionSchemaService){
        this.dynamicDataModel = dynamicDataModel;
        this.collectionSchemaService = collectionSchemaService;
    }
};
RelationshipService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _mongoose.InjectModel)(_dynamicdataschema.DynamicData.name)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose1.Model === "undefined" ? Object : _mongoose1.Model,
        typeof _collectionschemaservice.CollectionSchemaService === "undefined" ? Object : _collectionschemaservice.CollectionSchemaService
    ])
], RelationshipService);

//# sourceMappingURL=relationship.service.js.map