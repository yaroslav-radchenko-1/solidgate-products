import { Body, Controller, Get, Put } from '@nestjs/common';
import {
  SettingsService,
  SolidgateSettings,
} from '../services/settings.service';
import { UpdateSettingsDto } from '../dto/update-settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  public async getSettings(): Promise<SolidgateSettings> {
    return this.settingsService.getSolidgateSettings();
  }

  @Put()
  public async updateSettings(
    @Body() dto: UpdateSettingsDto,
  ): Promise<SolidgateSettings> {
    return this.settingsService.saveSolidgateSettings(dto);
  }
}
