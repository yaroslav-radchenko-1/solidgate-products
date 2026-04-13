import { Injectable } from '@nestjs/common';
import { Setting } from '../models/setting.model';
import { SettingsRepository } from '../repositories/settings.repository';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  public async getAll(): Promise<Setting[]> {
    return this.settingsRepository.findAll();
  }

  public async get(key: string): Promise<Setting | null> {
    return this.settingsRepository.findByKey(key);
  }

  public async getByKeys(keys: string[]): Promise<Setting[]> {
    return this.settingsRepository.findByKeys(keys);
  }

  public async set(key: string, value: string): Promise<Setting> {
    const settings = await this.settingsRepository.upsert([
      { key, value } as Setting,
    ]);

    return settings[0];
  }

  public async bulkUpsert(
    items: { key: string; value: string }[],
  ): Promise<Setting[]> {
    const settings = items.map((item) => {
      const setting = new Setting();
      setting.key = item.key;
      setting.value = item.value;

      return setting;
    });

    return this.settingsRepository.upsert(settings);
  }
}
