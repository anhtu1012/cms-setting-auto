import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Chỉ validate nếu metadata.data là 'databaseId' hoặc 'id'
    const shouldValidate =
      metadata.type === 'param' &&
      (metadata.data === 'databaseId' || metadata.data === 'id');

    if (shouldValidate) {
      if (!Types.ObjectId.isValid(value)) {
        throw new BadRequestException(
          `Invalid ${metadata.data} format: "${value}". Must be a 24 character hex string.`,
        );
      }
    }

    return value;
  }
}
