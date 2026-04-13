import { Body, Controller, Get, Put } from '@nestjs/common';
import { Setting } from '../models/setting.model';
import { SettingsService } from '../services/settings.service';
import { UpdateSettingDto } from '../dto/update-settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  public async findAll(): Promise<Setting[]> {
    return this.settingsService.getAll();
  }

  @Put()
  public async bulkUpsert(@Body() dto: UpdateSettingDto[]): Promise<Setting[]> {
    return this.settingsService.bulkUpsert(dto);
  }
}
