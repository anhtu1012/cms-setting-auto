import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content, ContentDocument } from './schemas/content.schema';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
import {
  PaginationDto,
  PaginationResponse,
} from '../../common/dto/pagination.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const createdContent = new this.contentModel(createContentDto);
    return createdContent.save();
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<Content>> {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { excerpt: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.contentModel
        .find(query)
        .populate('author', 'firstName lastName email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.contentModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Content | null> {
    return this.contentModel
      .findById(id)
      .populate('author', 'firstName lastName email')
      .exec();
  }

  async findBySlug(slug: string): Promise<Content | null> {
    return this.contentModel
      .findOne({ slug })
      .populate('author', 'firstName lastName email')
      .exec();
  }

  async findByStatus(status: string): Promise<Content[]> {
    return this.contentModel
      .find({ status })
      .populate('author', 'firstName lastName email')
      .exec();
  }

  async update(
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<Content | null> {
    if (updateContentDto.status === 'published') {
      updateContentDto['publishedAt'] = new Date();
    }

    return this.contentModel
      .findByIdAndUpdate(id, updateContentDto, { new: true })
      .populate('author', 'firstName lastName email')
      .exec();
  }

  async incrementViewCount(id: string): Promise<Content | null> {
    return this.contentModel
      .findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Content | null> {
    return this.contentModel.findByIdAndDelete(id).exec();
  }
}
