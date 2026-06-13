import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  @MinLength(1)
  public publicKey: string;

  // Optional: only sent when the user enters a new secret key. When omitted
  // or empty, the stored secret key is left unchanged.
  @IsOptional()
  @IsString()
  public secretKey?: string;
}
