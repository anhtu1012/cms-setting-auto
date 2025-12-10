import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  DynamicData,
  DynamicDataDocument,
} from '../../schemas/dynamic-data.schema';
import { CollectionSchemaService } from '../collection-schema/collection-schema.service';
import {
  FieldType,
  RelationType,
} from '../../interfaces/field-types.interface';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectModel(DynamicData.name)
    private dynamicDataModel: Model<DynamicDataDocument>,
    private collectionSchemaService: CollectionSchemaService,
  ) {}

  /**
   * Populate references trong document
   */
  async populateDocument(
    collectionName: string,
    databaseId: string,
    document: any,
    depth: number = 1,
    visitedCollections: Set<string> = new Set(),
  ): Promise<any> {
    if (depth <= 0) return document;
    if (visitedCollections.has(collectionName)) return document; // Tránh circular reference

    visitedCollections.add(collectionName);

    const schema = await this.collectionSchemaService.findByNamePublic(
      collectionName,
      databaseId,
    );

    if (!schema) return document;

    const plainDoc = document.toObject ? document.toObject() : document;
    const { _data, ...rest } = plainDoc;
    const populatedData = { ..._data };

    // Tìm các field có type REFERENCE
    const referenceFields = schema.fields.filter(
      (field) => field.type === FieldType.REFERENCE && field.referenceConfig,
    );

    for (const field of referenceFields) {
      const refConfig = field.referenceConfig!;
      const fieldValue = _data[field.name];

      if (!fieldValue) continue;

      // Kiểm tra autoPopulate
      if (refConfig.autoPopulate === false) continue;

      try {
        if (refConfig.multiple && Array.isArray(fieldValue)) {
          // Multiple references
          const populated = await this.populateMultipleReferences(
            refConfig.collection,
            databaseId,
            fieldValue,
            refConfig.populateFields,
            depth - 1,
            new Set(visitedCollections),
          );
          populatedData[field.name] = populated;
        } else if (!Array.isArray(fieldValue)) {
          // Single reference
          const populated = await this.populateSingleReference(
            refConfig.collection,
            databaseId,
            fieldValue,
            refConfig.populateFields,
            depth - 1,
            new Set(visitedCollections),
          );
          populatedData[field.name] = populated;
        }
      } catch (error) {
        console.error(`Error populating field ${field.name}:`, error.message);
        // Giữ nguyên giá trị gốc nếu populate lỗi
      }
    }

    return {
      ...rest,
      ...populatedData,
    };
  }

  /**
   * Populate multiple documents
   */
  async populateDocuments(
    collectionName: string,
    databaseId: string,
    documents: any[],
    depth: number = 1,
  ): Promise<any[]> {
    const visitedCollections = new Set<string>();
    return Promise.all(
      documents.map((doc) =>
        this.populateDocument(
          collectionName,
          databaseId,
          doc,
          depth,
          new Set(visitedCollections),
        ),
      ),
    );
  }

  /**
   * Populate single reference
   */
  private async populateSingleReference(
    collectionName: string,
    databaseId: string,
    refId: string,
    fields?: string[],
    depth: number = 0,
    visitedCollections: Set<string> = new Set(),
  ): Promise<any> {
    try {
      const objectId = new Types.ObjectId(refId);
      const doc = await this.dynamicDataModel.findOne({
        _id: objectId,
        _collection: collectionName,
        databaseId: new Types.ObjectId(databaseId),
        deletedAt: null,
      });

      if (!doc) return null;

      // Nếu có chỉ định fields cụ thể
      let result: any;
      if (fields && fields.length > 0) {
        result = { _id: doc._id };
        fields.forEach((field) => {
          if (doc._data[field] !== undefined) {
            result[field] = doc._data[field];
          }
        });
      } else {
        result = doc.toObject();
        const { _data, ...rest } = result;
        result = { ...rest, ..._data };
      }

      // Populate nested references nếu depth > 0
      if (depth > 0) {
        return this.populateDocument(
          collectionName,
          databaseId,
          result,
          depth,
          visitedCollections,
        );
      }

      return result;
    } catch (error) {
      console.error('Error populating single reference:', error.message);
      return null;
    }
  }

  /**
   * Populate multiple references
   */
  private async populateMultipleReferences(
    collectionName: string,
    databaseId: string,
    refIds: string[],
    fields?: string[],
    depth: number = 0,
    visitedCollections: Set<string> = new Set(),
  ): Promise<any[]> {
    try {
      const objectIds = refIds
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id));

      if (objectIds.length === 0) return [];

      const docs = await this.dynamicDataModel.find({
        _id: { $in: objectIds },
        _collection: collectionName,
        databaseId: new Types.ObjectId(databaseId),
        deletedAt: null,
      });

      // Transform và filter fields
      let results = docs.map((doc) => {
        if (fields && fields.length > 0) {
          const result: any = { _id: doc._id };
          fields.forEach((field) => {
            if (doc._data[field] !== undefined) {
              result[field] = doc._data[field];
            }
          });
          return result;
        } else {
          const plainDoc = doc.toObject();
          const { _data, ...rest } = plainDoc;
          return { ...rest, ..._data };
        }
      });

      // Populate nested references nếu depth > 0
      if (depth > 0) {
        results = await Promise.all(
          results.map((result) =>
            this.populateDocument(
              collectionName,
              databaseId,
              result,
              depth,
              visitedCollections,
            ),
          ),
        );
      }

      return results;
    } catch (error) {
      console.error('Error populating multiple references:', error.message);
      return [];
    }
  }

  /**
   * Validate reference ID exists
   */
  async validateReference(
    collectionName: string,
    databaseId: string,
    refId: string,
  ): Promise<boolean> {
    try {
      const objectId = new Types.ObjectId(refId);
      const exists = await this.dynamicDataModel.exists({
        _id: objectId,
        _collection: collectionName,
        databaseId: new Types.ObjectId(databaseId),
        deletedAt: null,
      });
      return !!exists;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate multiple references
   */
  async validateReferences(
    collectionName: string,
    databaseId: string,
    refIds: string[],
  ): Promise<{ valid: boolean; invalidIds: string[] }> {
    const invalidIds: string[] = [];

    for (const refId of refIds) {
      const isValid = await this.validateReference(
        collectionName,
        databaseId,
        refId,
      );
      if (!isValid) {
        invalidIds.push(refId);
      }
    }

    return {
      valid: invalidIds.length === 0,
      invalidIds,
    };
  }

  /**
   * Get inverse relationships (tìm tất cả documents reference đến document này)
   */
  async getInverseRelations(
    collectionName: string,
    databaseId: string,
    documentId: string,
    inverseCollectionName: string,
    inverseFieldName: string,
  ): Promise<any[]> {
    try {
      const docs = await this.dynamicDataModel.find({
        _collection: inverseCollectionName,
        databaseId: new Types.ObjectId(databaseId),
        [`_data.${inverseFieldName}`]: documentId,
        deletedAt: null,
      });

      return docs.map((doc) => {
        const plainDoc = doc.toObject();
        const { _data, ...rest } = plainDoc;
        return { ...rest, ..._data };
      });
    } catch (error) {
      console.error('Error getting inverse relations:', error.message);
      return [];
    }
  }

  /**
   * Cascade delete references khi xóa document
   */
  async cascadeDelete(
    collectionName: string,
    databaseId: string,
    documentId: string,
  ): Promise<void> {
    const schema = await this.collectionSchemaService.findByNamePublic(
      collectionName,
      databaseId,
    );

    if (!schema) return;

    // Tìm các field có cascadeDelete = true
    const cascadeFields = schema.fields.filter(
      (field) =>
        field.type === FieldType.REFERENCE &&
        field.referenceConfig?.cascadeDelete,
    );

    for (const field of cascadeFields) {
      const refConfig = field.referenceConfig!;
      const doc = await this.dynamicDataModel.findOne({
        _id: new Types.ObjectId(documentId),
        _collection: collectionName,
        databaseId: new Types.ObjectId(databaseId),
      });

      if (!doc) continue;

      const refValue = doc._data[field.name];
      if (!refValue) continue;

      try {
        if (refConfig.multiple && Array.isArray(refValue)) {
          // Xóa multiple references
          await this.dynamicDataModel.deleteMany({
            _id: { $in: refValue.map((id) => new Types.ObjectId(id)) },
            _collection: refConfig.collection,
            databaseId: new Types.ObjectId(databaseId),
          });
        } else if (!Array.isArray(refValue)) {
          // Xóa single reference
          await this.dynamicDataModel.deleteOne({
            _id: new Types.ObjectId(refValue),
            _collection: refConfig.collection,
            databaseId: new Types.ObjectId(databaseId),
          });
        }
      } catch (error) {
        console.error(
          `Error cascade deleting field ${field.name}:`,
          error.message,
        );
      }
    }
  }
}
