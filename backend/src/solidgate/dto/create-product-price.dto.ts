import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateProductPriceDto {
  @IsBoolean()
  public default: boolean;

  @IsIn(['active'])
  public status: 'active';

  @IsNumber()
  public product_price: number;

  @IsString()
  @Length(3, 3)
  public currency: string;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  public country?: string;

  @IsOptional()
  @IsNumber()
  public trial_price?: number;
}
