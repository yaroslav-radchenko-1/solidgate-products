import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Setting } from '../models/setting.model';

@Injectable()
export class SettingsRepository {
  constructor(
    @InjectRepository(Setting)
    private readonly repository: Repository<Setting>,
  ) {}

  public async findAll(): Promise<Setting[]> {
    return this.repository.find();
  }

  public async findByKey(key: string): Promise<Setting | null> {
    return this.repository.findOneBy({ key });
  }

  public async findByKeys(keys: string[]): Promise<Setting[]> {
    return this.repository.findBy({ key: In(keys) });
  }

  public async upsert(settings: Setting[]): Promise<Setting[]> {
    return this.repository.save(settings);
  }
}
