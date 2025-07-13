import { IFighterRepository } from '../../domain/interfaces/fighter.repository';
import { Fighter } from '../../domain/entities/fighter.entity';

export class CreateFighterUseCase {
  constructor(private readonly repo: IFighterRepository) {}

  async execute(input: Omit<Fighter, 'id'>): Promise<Fighter> {
    const fighter = new Fighter(
      0,
      input.fullName,
      input.nickname,
      input.birthDate,
      input.height,
      input.weight,
      input.team,
      input.weightClassId,
    );
    return this.repo.create(fighter);
  }
}
