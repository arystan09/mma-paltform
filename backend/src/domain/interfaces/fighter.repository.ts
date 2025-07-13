import { Fighter } from '../entities/fighter.entity';

export interface IFighterRepository {
  create(fighter: Fighter): Promise<Fighter>;
  findById(id: number): Promise<Fighter | null>;
  findAll(): Promise<Fighter[]>;
}
