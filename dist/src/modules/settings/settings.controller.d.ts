import { SettingsService } from './settings.service';
import { CreateSettingDto, UpdateSettingDto } from './dto/setting.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    create(createSettingDto: CreateSettingDto): Promise<import("./schemas/setting.schema").Setting>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/dto/pagination.dto").PaginationResponse<import("./schemas/setting.schema").Setting>>;
    findByCategory(category: string): Promise<import("./schemas/setting.schema").Setting[]>;
    findByKey(key: string): Promise<import("./schemas/setting.schema").Setting>;
    findOne(id: string): Promise<import("./schemas/setting.schema").Setting>;
    update(id: string, updateSettingDto: UpdateSettingDto): Promise<import("./schemas/setting.schema").Setting>;
    updateByKey(key: string, body: {
        value: any;
    }): Promise<import("./schemas/setting.schema").Setting>;
    remove(id: string): Promise<import("./schemas/setting.schema").Setting>;
}
