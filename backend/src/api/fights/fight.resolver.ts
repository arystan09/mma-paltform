import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { FightOrm } from 'infrastructure/database/typeorm/fight.orm-entity';
import { Repository } from 'typeorm';
import { CreateFightInput } from './dto/create-fight.input';
import { RecordFightResultInput } from './dto/record-fight-result.input';
import { FightOutput } from './dto/fight.output';
import { rankingQueue } from 'infrastructure/queues/ranking/ranking.queue';

@Resolver(() => FightOutput)
export class FightResolver {
  constructor(
    @InjectRepository(FightOrm)
    private readonly fightRepo: Repository<FightOrm>,
  ) {}

  // Создание боя
  @Mutation(() => FightOutput)
  async createFight(@Args('input') input: CreateFightInput): Promise<FightOutput> {
    const fight = this.fightRepo.create({
      event: { id: input.eventId } as any,
      redCorner: { id: input.redCornerId } as any,
      blueCorner: { id: input.blueCornerId } as any,
      weightClass: { id: input.weightClassId } as any,
    });

    const saved = await this.fightRepo.save(fight);

    return {
      id: saved.id,
      eventId: saved.event.id,
      redCornerId: saved.redCorner.id,
      blueCornerId: saved.blueCorner.id,
      winnerId: undefined,
      method: undefined,
      round: undefined,
      duration: undefined,
      isFinished: saved.is_finished,
      weightClassId: saved.weightClass.id,
      createdAt: saved.created_at,
      updatedAt: saved.updated_at,
    };
  }

  // Запись результата боя
  @Mutation(() => FightOutput)
  async recordFightResult(
    @Args('input') input: RecordFightResultInput,
  ): Promise<FightOutput> {
    const fight = await this.fightRepo.findOne({
      where: { id: input.fightId },
      relations: ['event', 'redCorner', 'blueCorner', 'weightClass', 'winner'],
    });
    if (!fight) {
      throw new Error(`Fight with ID ${input.fightId} not found`);
    }

    fight.winner = { id: input.winnerId } as any;
    fight.method = input.method;
    fight.round = input.round;
    fight.duration = input.duration;
    await this.fightRepo.update(fight.id, {
    winner: { id: input.winnerId } as any,
    method: input.method,
    round: input.round,
    duration: input.duration,
    is_finished: true,
  });

    const updated = await this.fightRepo.findOne({
      where: { id: fight.id },
      relations: ['event', 'redCorner', 'blueCorner', 'winner', 'weightClass'],
    });

    if (!updated) {
      throw new Error(`Fight with ID ${fight.id} was not found after update`);
    }

    return {
      id: updated.id,
      eventId: updated.event.id,
      redCornerId: updated.redCorner.id,
      blueCornerId: updated.blueCorner.id,
      winnerId: updated.winner?.id ?? undefined,
      method: updated.method ?? undefined,
      round: updated.round ?? undefined,
      duration: updated.duration ?? undefined,
      isFinished: updated.is_finished,
      weightClassId: updated.weightClass.id,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    };
  }

  // Получение списка всех боёв
  @Query(() => [FightOutput])
  async getFights(): Promise<FightOutput[]> {
    const fights = await this.fightRepo.find({
      relations: ['event', 'redCorner', 'blueCorner', 'winner', 'weightClass'],
    });

    return fights.map(f => ({
      id: f.id,
      eventId: f.event.id,
      redCornerId: f.redCorner.id,
      blueCornerId: f.blueCorner.id,
      winnerId: f.winner?.id ?? undefined,
      method: f.method ?? undefined,
      round: f.round ?? undefined,
      duration: f.duration ?? undefined,
      isFinished: f.is_finished,
      weightClassId: f.weightClass?.id ?? null,
      createdAt: f.created_at,
      updatedAt: f.updated_at,
    }));
  }

  // История боёв бойца
  @Query(() => [FightOutput])
  async fightsByFighterId(
    @Args('fighterId', { type: () => Int }) fighterId: number,
  ): Promise<FightOutput[]> {
    const fights = await this.fightRepo.find({
      where: [
        { redCorner: { id: fighterId } },
        { blueCorner: { id: fighterId } },
      ],
      relations: ['event', 'redCorner', 'blueCorner', 'winner', 'weightClass'],
    });

    return fights.map(f => ({
      id: f.id,
      eventId: f.event.id,
      redCornerId: f.redCorner.id,
      blueCornerId: f.blueCorner.id,
      winnerId: f.winner?.id ?? undefined,
      method: f.method ?? undefined,
      round: f.round ?? undefined,
      duration: f.duration ?? undefined,
      isFinished: f.is_finished,
      weightClassId: f.weightClass?.id ?? null,
      createdAt: f.created_at,
      updatedAt: f.updated_at,
    }));
  }
}
