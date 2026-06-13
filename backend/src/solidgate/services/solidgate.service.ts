import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { createHmac } from 'crypto';
import { solidgateConfig } from '../solidgate.config';
import { CreateProductDto } from '../dto/create-product.dto';
import { CreateProductPriceDto } from '../dto/create-product-price.dto';
import { SettingsService } from '../../settings/services/settings.service';

const BASE_URL = 'https://subscriptions.solidgate.com/api/v1';

@Injectable()
export class SolidgateService {
  constructor(
    @Inject(solidgateConfig.KEY)
    private readonly config: ConfigType<typeof solidgateConfig>,
    private readonly settingsService: SettingsService,
  ) {}

  private async getCredentials(): Promise<{
    publicKey: string;
    secretKey: string;
  }> {
    const settings = await this.settingsService.getByKeys([
      'solidgate_public_key',
      'solidgate_secret_key',
    ]);

    const settingsMap = new Map(settings.map((s) => [s.key, s.value]));

    const publicKey =
      settingsMap.get('solidgate_public_key') || this.config.publicKey;
    const secretKey =
      settingsMap.get('solidgate_secret_key') || this.config.secretKey;

    if (!publicKey || !secretKey) {
      throw new HttpException(
        {
          error: {
            messages: [
              'Solidgate API keys are not configured. Open "API Settings" ' +
                'and enter your public and secret keys.',
            ],
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return { publicKey, secretKey };
  }

  private async makeRequest<T>(
    method: string,
    path: string,
    body: object,
  ): Promise<T> {
    const { publicKey, secretKey } = await this.getCredentials();
    const jsonBody = JSON.stringify(body);

    const hex = createHmac('sha512', secretKey)
      .update(publicKey + jsonBody + publicKey)
      .digest('hex');
    const signature = Buffer.from(hex).toString('base64');

    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        merchant: publicKey,
        signature,
      },
      body: jsonBody,
    });

    const text = await response.text();
    let parsed: unknown;
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = { error: { messages: [text || response.statusText] } };
    }

    if (!response.ok) {
      throw new HttpException(
        parsed as Record<string, unknown>,
        response.status,
      );
    }

    return parsed as T;
  }

  public async createProduct(dto: CreateProductDto): Promise<unknown> {
    return this.makeRequest('POST', '/products', dto);
  }

  public async createProductPrice(
    productId: string,
    dto: CreateProductPriceDto,
  ): Promise<unknown> {
    return this.makeRequest('POST', `/products/${productId}/prices`, dto);
  }
}
