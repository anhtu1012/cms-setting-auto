import { Model } from 'mongoose';
import { Content, ContentDocument } from './schemas/content.schema';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
import { PaginationDto, PaginationResponse } from '../../common/dto/pagination.dto';
export declare class ContentService {
    private contentModel;
    constructor(contentModel: Model<ContentDocument>);
    create(createContentDto: CreateContentDto): Promise<Content>;
    findAll(paginationDto: PaginationDto): Promise<PaginationResponse<Content>>;
    findOne(id: string): Promise<Content | null>;
    findBySlug(slug: string): Promise<Content | null>;
    findByStatus(status: string): Promise<Content[]>;
    update(id: string, updateContentDto: UpdateContentDto): Promise<Content | null>;
    incrementViewCount(id: string): Promise<Content | null>;
    remove(id: string): Promise<Content | null>;
}
