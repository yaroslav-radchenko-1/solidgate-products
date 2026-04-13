import { Controller, Get } from '@nestjs/common';
import { ExchangeRatesService } from '../services/exchange-rates.service';

@Controller('exchange-rates')
export class ExchangeRatesController {
  constructor(private readonly exchangeRatesService: ExchangeRatesService) {}

  @Get()
  public async getRates(): Promise<{
    rates: Record<string, number>;
    timestamp: number;
  }> {
    return this.exchangeRatesService.getRates();
  }
}
