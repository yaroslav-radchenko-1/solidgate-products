import { Injectable } from '@nestjs/common';

interface CachedRates {
  rates: Record<string, number>;
  timestamp: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class ExchangeRatesService {
  private cache: CachedRates | null = null;

  public async getRates(): Promise<CachedRates> {
    if (this.cache && Date.now() - this.cache.timestamp < CACHE_TTL_MS) {
      return this.cache;
    }

    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = (await response.json()) as {
      rates: Record<string, number>;
      time_last_update_unix: number;
    };

    this.cache = {
      rates: data.rates,
      timestamp: Date.now(),
    };

    return this.cache;
  }
}
