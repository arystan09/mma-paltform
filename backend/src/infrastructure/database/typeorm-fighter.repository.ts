import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FighterOrm } from './typeorm/fighter.orm-entity';
import { IFighterRepository } from 'domain/interfaces/fighter.repository';
import { Fighter } from 'domain/entities/fighter.entity';

@Injectable()
export class TypeOrmFighterRepository implements IFighterRepository {
  constructor(
    @InjectRepository(FighterOrm)
    private readonly repo: Repository<FighterOrm>,
  ) {}

  async create(f: Fighter): Promise<Fighter> {
    const entity = this.repo.create({ ...f });
    const saved = await this.repo.save(entity);
    return new Fighter(
      saved.id,
      saved.fullName,
      saved.nickname,
      saved.birthDate,
      saved.height,
      saved.weight,
      saved.team,
      saved.weightClassId,
    );
  }

  async findById(id: number): Promise<Fighter | null> {
    const f = await this.repo.findOneBy({ id });
    if (!f) return null;
    return new Fighter(f.id, f.fullName, f.nickname, f.birthDate, f.height, f.weight, f.team, f.weightClassId);
  }

  async findAll(): Promise<Fighter[]> {
    const all = await this.repo.find();
    return all.map(f => new Fighter(f.id, f.fullName, f.nickname, f.birthDate, f.height, f.weight, f.team, f.weightClassId));
  }
}
