import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateFighterInput } from './dto/create-fighter.input';
import { FighterOutput } from './dto/fighter.output';
import { FighterStatsOutput } from './dto/fighter-stats.output';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FighterOrm } from 'infrastructure/database/typeorm/fighter.orm-entity';
import { FightOrm } from 'infrastructure/database/typeorm/fight.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';

@Resolver(() => FighterOutput)
@Injectable()
export class FighterResolver {
  constructor(
    @InjectRepository(FighterOrm)
    private readonly fighterRepo: Repository<FighterOrm>,

    @InjectRepository(FightOrm)
    private readonly fightRepo: Repository<FightOrm>,
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

  @Query(() => FighterStatsOutput)
  async fighterStats(
    @Args('fighterId', { type: () => Int }) fighterId: number,
  ): Promise<FighterStatsOutput> {
    const fights = await this.fightRepo.find({
      where: [
        { redCorner: { id: fighterId } },
        { blueCorner: { id: fighterId } },
      ],
      relations: ['winner'],
    });

    let wins = 0;
    let losses = 0;
    let draws = 0;

    for (const fight of fights) {
      if (!fight.winner) continue;

      if (fight.winner.id === fighterId) wins++;
      else losses++;
    }

    return { fighterId, wins, losses, draws };
  }
}

function mapFighterOrmToOutput(f: FighterOrm): FighterOutput {
  return {
    id: f.id,
    fullName: f.fullName,
    nickname: f.nickname,
    birthDate: f.birthDate ? new Date(f.birthDate.toString()) : null,
    height: f.height,
    weight: f.weight,
    team: f.team,
    weightClassId: f.weightClass?.id ?? 0,
    country: f.country ?? undefined,
    reach_cm: f.reach_cm ?? undefined,
    stance: f.stance ?? undefined,
    created_at: f.created_at,
    updated_at: f.updated_at,
  };
}
