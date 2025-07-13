import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateFighterInput } from './dto/create-fighter.input';
import { FighterOutput } from './dto/fighter.output';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FighterOrm } from 'infrastructure/database/typeorm/fighter.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';

@Resolver(() => FighterOutput)
@Injectable()
export class FighterResolver {
  constructor(
    @InjectRepository(FighterOrm)
    private readonly fighterRepo: Repository<FighterOrm>,
  ) {}

  @Mutation(() => FighterOutput)
  async createFighter(@Args('input') input: CreateFighterInput): Promise<FighterOutput> {
    const fighter = this.fighterRepo.create({
      ...input,
      birthDate: new Date(input.birthDate),
      weightClass: { id: input.weightClassId } as any,
    });
    const saved = await this.fighterRepo.save(fighter);
    return mapFighterOrmToOutput(saved);
  }

  @Query(() => [FighterOutput])
  async getFighters(): Promise<FighterOutput[]> {
    const fighters = await this.fighterRepo.find({ relations: ['weightClass'] });
    return fighters.map(mapFighterOrmToOutput);
  }

  @Query(() => FighterOutput, { nullable: true })
  async getFighterById(@Args('id') id: number): Promise<FighterOutput | null> {
    const f = await this.fighterRepo.findOne({
      where: { id },
      relations: ['weightClass'],
    });

    if (!f) return null;

    return mapFighterOrmToOutput(f);
  }
}

function mapFighterOrmToOutput(f: FighterOrm): FighterOutput {
  return {
    id: f.id,
    fullName: f.fullName,
    nickname: f.nickname,
    birthDate: f.birthDate,
    height: f.height,
    weight: f.weight,
    team: f.team,
    weightClassId: f.weightClass?.id ?? 0,
  };
}
