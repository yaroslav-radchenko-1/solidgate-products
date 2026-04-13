import { Body, Controller, Param, Post } from '@nestjs/common';
import { SolidgateService } from '../services/solidgate.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { CreateProductPriceDto } from '../dto/create-product-price.dto';

@Controller('solidgate')
export class SolidgateController {
  constructor(private readonly solidgateService: SolidgateService) {}

  @Post('products')
  public async createProduct(@Body() dto: CreateProductDto): Promise<unknown> {
    return this.solidgateService.createProduct(dto);
  }

  @Post('products/:productId/prices')
  public async createProductPrice(
    @Param('productId') productId: string,
    @Body() dto: CreateProductPriceDto,
  ): Promise<unknown> {
    return this.solidgateService.createProductPrice(productId, dto);
  }
}
