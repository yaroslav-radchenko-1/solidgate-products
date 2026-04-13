import {
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  public name: string;

  @IsIn(['recurring', 'one-time'])
  public type: 'recurring' | 'one-time';

  @IsString()
  @MinLength(1)
  public description: string;

  @IsIn(['active'])
  public status: 'active';

  @IsString()
  public payment_action: string = 'auth_settle';

  @IsNumber()
  public settle_interval: number = 120;

  @IsOptional()
  @IsObject()
  public billing_period?: object;

  @IsOptional()
  @IsObject()
  public trial?: object;

  @IsOptional()
  @IsString()
  public retry_mode?: string;

  @IsOptional()
  @IsString()
  public retry_strategy_id?: string;
}
