import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FighterOrm } from 'infrastructure/database/typeorm/fighter.orm-entity';
import { FightOrm } from 'infrastructure/database/typeorm/fight.orm-entity';

import { CreateFighterInput } from './dto/create-fighter.input';
import { UpdateFighterInput } from './dto/update-fighter.input';
import { FighterOutput } from './dto/fighter.output';
import { FighterStatsOutput } from './dto/fighter-stats.output';
import { FightMethod } from 'common/enums/fight-method.enum';

@Resolver(() => FighterOutput)
@Injectable()
export class FighterResolver {
  constructor(
    @InjectRepository(FighterOrm)
    private readonly fighterRepo: Repository<FighterOrm>,

    @InjectRepository(FightOrm)
    private readonly fightRepo: Repository<FightOrm>,
  ) {}

  // CREATE
  @Mutation(() => FighterOutput)
  async createFighter(
    @Args('input') input: CreateFighterInput,
  ): Promise<FighterOutput> {
    const fighter = this.fighterRepo.create({
      ...input,
      birthDate: new Date(input.birthDate),
      weightClass: { id: input.weightClassId } as any,
    });
    const saved = await this.fighterRepo.save(fighter);
    return mapFighterOrmToOutput(saved);
  }

  //READ
  @Query(() => [FighterOutput])
  async getAllFighters(): Promise<FighterOutput[]> {
    const fighters = await this.fighterRepo.find({ relations: ['weightClass'] });
    return fighters.map(mapFighterOrmToOutput);
  }

  @Query(() => FighterOutput, { nullable: true })
  async getFighterById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<FighterOutput | null> {
    const f = await this.fighterRepo.findOne({
      where: { id },
      relations: ['weightClass'],
    });
    return f ? mapFighterOrmToOutput(f) : null;
  }

  // UPDATE
  @Mutation(() => FighterOutput)
  async updateFighter(
    @Args('input') input: UpdateFighterInput,
  ): Promise<FighterOutput> {
    const fighter = await this.fighterRepo.findOne({
      where: { id: input.id },
      relations: ['weightClass'],
    });
    if (!fighter) {
      throw new Error(`Fighter with ID ${input.id} not found`);
    }

    // применяем обновления
    Object.assign(fighter, {
      ...input,
      birthDate: input.birthDate ? new Date(input.birthDate) : fighter.birthDate,
    });

    if (input.weightClassId) {
      fighter.weightClass = { id: input.weightClassId } as any;
    }

    const updated = await this.fighterRepo.save(fighter);
    return mapFighterOrmToOutput(updated);
  }

  // DELETE

  @Mutation(() => Boolean)
  async deleteFighter(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    try {
      await this.fighterRepo.delete(id);
      return true;
    } catch (error) {
      // Проверка на ошибку связей (foreign key)
      if (
        error instanceof Error &&
        error.message.includes('violates foreign key constraint')
      ) {
        throw new Error(
          `Unable to delete fighter with ID ${id} because he participated in battles.`,
        );
      }
      throw error;
    }
  }

  // STATS BY FIGHTER
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
      order: { created_at: 'ASC' },
    });

    let wins = 0;
    let losses = 0;
    let draws = 0;
    let koWins = 0;
    let submissionWins = 0;
    let decisionWins = 0;

    const fightIds: number[] = [];

    for (const fight of fights) {
      if (!fight.is_finished) continue;

      fightIds.push(fight.id);

      if (!fight.winner) {
        draws++;
        continue;
      }

      if (fight.winner.id === fighterId) {
        wins++;
        if (fight.method === FightMethod.KO) koWins++;
        if (fight.method === FightMethod.SUBMISSION) submissionWins++;
        if (fight.method === FightMethod.DECISION) decisionWins++;
      } else {
        losses++;
      }
    }

    const totalFights = wins + losses + draws;
    const winRate = totalFights > 0 ? parseFloat(((wins / totalFights) * 100).toFixed(2)) : 0;
    const lastFightId = fightIds.at(-1);

    return {
      totalFights,
      wins,
      losses,
      draws,
      koWins,
      submissionWins,
      decisionWins,
      winRate,
      lastFightId,
      fightIds,
    };
  }
}

// MAPPER 
function mapFighterOrmToOutput(f: FighterOrm): FighterOutput {
  return {
    id: f.id,
    fullName: f.fullName,
    nickname: f.nickname,
    birthDate: f.birthDate,
    height: f.height,
    weight: f.weight,
    team: f.team,
    weightClassId: f.weightClass?.id ?? null,
    country: f.country ?? undefined,
    reach_cm: f.reach_cm ?? undefined,
    stance: f.stance ?? undefined,
    created_at: f.created_at,
    updated_at: f.updated_at,
  };
}
