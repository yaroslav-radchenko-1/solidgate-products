import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../models/template.model';

@Injectable()
export class TemplatesRepository {
  constructor(
    @InjectRepository(Template)
    private readonly repository: Repository<Template>,
  ) {}

  public async findAll(): Promise<Template[]> {
    return this.repository.find({
      select: ['id', 'name', 'updatedAt'],
      order: { updatedAt: 'DESC' },
    });
  }

  public async findById(id: string): Promise<Template | null> {
    return this.repository.findOneBy({ id });
  }

  public async save(template: Template): Promise<Template> {
    return this.repository.save(template);
  }

  public async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
