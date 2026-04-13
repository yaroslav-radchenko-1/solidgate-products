import { IsString, MinLength } from 'class-validator';

export class UpdateTemplateDto {
  @IsString()
  @MinLength(1)
  public name: string;

  @IsString()
  @MinLength(1)
  public data: string;
}
