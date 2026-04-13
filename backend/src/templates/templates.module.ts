import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesController } from './controllers/templates.controller';
import { Template } from './models/template.model';
import { TemplatesRepository } from './repositories/templates.repository';
import { TemplatesService } from './services/templates.service';

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  controllers: [TemplatesController],
  providers: [TemplatesService, TemplatesRepository],
})
export class TemplatesModule {}
