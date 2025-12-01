import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    create(createContentDto: CreateContentDto): Promise<import("./schemas/content.schema").Content>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/dto/pagination.dto").PaginationResponse<import("./schemas/content.schema").Content>>;
    findByStatus(status: string): Promise<import("./schemas/content.schema").Content[]>;
    findBySlug(slug: string): Promise<import("./schemas/content.schema").Content>;
    findOne(id: string): Promise<import("./schemas/content.schema").Content>;
    update(id: string, updateContentDto: UpdateContentDto): Promise<import("./schemas/content.schema").Content>;
    incrementViewCount(id: string): Promise<import("./schemas/content.schema").Content>;
    remove(id: string): Promise<import("./schemas/content.schema").Content>;
}
