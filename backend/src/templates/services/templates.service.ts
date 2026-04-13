import { Injectable, NotFoundException } from '@nestjs/common';
import { Template } from '../models/template.model';
import { TemplatesRepository } from '../repositories/templates.repository';

@Injectable()
export class TemplatesService {
  constructor(private readonly templatesRepository: TemplatesRepository) {}

  public async getAll(): Promise<Template[]> {
    return this.templatesRepository.findAll();
  }

  public async getById(id: string): Promise<Template> {
    const template = await this.templatesRepository.findById(id);
    if (!template) {
      throw new NotFoundException(`Template with id "${id}" not found`);
    }

    return template;
  }

  public async create(name: string, data: string): Promise<Template> {
    const template = new Template();
    template.name = name;
    template.data = data;

    return this.templatesRepository.save(template);
  }

  public async update(
    id: string,
    name: string,
    data: string,
  ): Promise<Template> {
    const template = await this.getById(id);
    template.name = name;
    template.data = data;

    return this.templatesRepository.save(template);
  }

  public async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.templatesRepository.remove(id);
  }
}
