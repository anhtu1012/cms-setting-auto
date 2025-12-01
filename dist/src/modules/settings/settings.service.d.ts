import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { CreateSettingDto, UpdateSettingDto } from './dto/setting.dto';
import { PaginationDto, PaginationResponse } from '../../common/dto/pagination.dto';
export declare class SettingsService {
    private settingModel;
    constructor(settingModel: Model<SettingDocument>);
    create(createSettingDto: CreateSettingDto): Promise<Setting>;
    findAll(paginationDto: PaginationDto): Promise<PaginationResponse<Setting>>;
    findOne(id: string): Promise<Setting | null>;
    findByKey(key: string): Promise<Setting | null>;
    findByCategory(category: string): Promise<Setting[]>;
    update(id: string, updateSettingDto: UpdateSettingDto): Promise<Setting | null>;
    updateByKey(key: string, value: any): Promise<Setting | null>;
    remove(id: string): Promise<Setting | null>;
}
