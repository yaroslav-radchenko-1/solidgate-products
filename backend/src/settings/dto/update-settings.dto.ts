import { IsString, MinLength } from 'class-validator';

export class UpdateSettingDto {
  @IsString()
  @MinLength(1)
  public key: string;

  @IsString()
  public value: string;
}
