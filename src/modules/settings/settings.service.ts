import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { CreateSettingDto, UpdateSettingDto } from './dto/setting.dto';
import {
  PaginationDto,
  PaginationResponse,
} from '../../common/dto/pagination.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) {}

  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    const createdSetting = new this.settingModel(createSettingDto);
    return createdSetting.save();
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<Setting>> {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { key: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.settingModel.find(query).skip(skip).limit(limit).exec(),
      this.settingModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Setting | null> {
    return this.settingModel.findById(id).exec();
  }

  async findByKey(key: string): Promise<Setting | null> {
    return this.settingModel.findOne({ key }).exec();
  }

  async findByCategory(category: string): Promise<Setting[]> {
    return this.settingModel.find({ category }).exec();
  }

  async update(
    id: string,
    updateSettingDto: UpdateSettingDto,
  ): Promise<Setting | null> {
    return this.settingModel
      .findByIdAndUpdate(id, updateSettingDto, { new: true })
      .exec();
  }

  async updateByKey(key: string, value: any): Promise<Setting | null> {
    return this.settingModel
      .findOneAndUpdate({ key }, { value }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Setting | null> {
    return this.settingModel.findByIdAndDelete(id).exec();
  }
}
