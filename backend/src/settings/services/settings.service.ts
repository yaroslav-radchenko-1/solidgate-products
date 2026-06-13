import { Injectable } from '@nestjs/common';
import { Setting } from '../models/setting.model';
import { SettingsRepository } from '../repositories/settings.repository';

const PUBLIC_KEY = 'solidgate_public_key';
const SECRET_KEY = 'solidgate_secret_key';

export type SolidgateSettings = {
  publicKey: string;
  hasSecretKey: boolean;
};

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  public async getByKeys(keys: string[]): Promise<Setting[]> {
    return this.settingsRepository.findByKeys(keys);
  }

  // Safe to expose to the client: returns the public key and only a boolean
  // indicating whether a secret key is stored — never the secret value.
  public async getSolidgateSettings(): Promise<SolidgateSettings> {
    const settings = await this.settingsRepository.findByKeys([
      PUBLIC_KEY,
      SECRET_KEY,
    ]);
    const values = new Map(settings.map((s) => [s.key, s.value]));

    return {
      publicKey: values.get(PUBLIC_KEY) ?? '',
      hasSecretKey: Boolean(values.get(SECRET_KEY)),
    };
  }

  public async saveSolidgateSettings(input: {
    publicKey: string;
    secretKey?: string;
  }): Promise<SolidgateSettings> {
    const publicKeySetting = new Setting();
    publicKeySetting.key = PUBLIC_KEY;
    publicKeySetting.value = input.publicKey;

    const toUpsert: Setting[] = [publicKeySetting];

    // Only overwrite the secret when a new non-empty value is provided, so a
    // blank field in the UI keeps the existing secret untouched.
    if (input.secretKey) {
      const secretKeySetting = new Setting();
      secretKeySetting.key = SECRET_KEY;
      secretKeySetting.value = input.secretKey;
      toUpsert.push(secretKeySetting);
    }

    await this.settingsRepository.upsert(toUpsert);

    return this.getSolidgateSettings();
  }
}
