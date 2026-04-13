import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SolidgateController } from './controllers/solidgate.controller';
import { SolidgateService } from './services/solidgate.service';
import { solidgateConfig } from './solidgate.config';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [ConfigModule.forFeature(solidgateConfig), SettingsModule],
  controllers: [SolidgateController],
  providers: [SolidgateService],
})
export class SolidgateModule {}
