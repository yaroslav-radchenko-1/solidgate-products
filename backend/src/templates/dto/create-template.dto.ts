import { IsString, MinLength } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @MinLength(1)
  public name: string;

  @IsString()
  @MinLength(1)
  public data: string;
}
