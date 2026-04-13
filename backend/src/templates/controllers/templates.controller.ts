import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Template } from '../models/template.model';
import { TemplatesService } from '../services/templates.service';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { UpdateTemplateDto } from '../dto/update-template.dto';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  public async findAll(): Promise<Template[]> {
    return this.templatesService.getAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Template> {
    return this.templatesService.getById(id);
  }

  @Post()
  public async create(@Body() dto: CreateTemplateDto): Promise<Template> {
    return this.templatesService.create(dto.name, dto.data);
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateDto,
  ): Promise<Template> {
    return this.templatesService.update(id, dto.name, dto.data);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    return this.templatesService.remove(id);
  }
}
