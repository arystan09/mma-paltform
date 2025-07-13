import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
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

  // 🥊 Создание боя
  @Mutation(() => FightOutput)
  async createFight(@Args('input') input: CreateFightInput): Promise<FightOutput> {
    const fight = this.fightRepo.create({
      event: { id: input.eventId } as any,
      redCorner: { id: input.redCornerId } as any,
      blueCorner: { id: input.blueCornerId } as any,
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
    };
  }

  // 🏆 Запись результата боя
  @Mutation(() => FightOutput)
  async recordFightResult(
    @Args('input') input: RecordFightResultInput,
  ): Promise<FightOutput> {
    const fight = await this.fightRepo.findOne({
      where: { id: input.fightId },
      relations: ['event', 'redCorner', 'blueCorner'],
    });

    if (!fight) {
      throw new Error(`Fight with ID ${input.fightId} not found`);
    }

    fight.winner = { id: input.winnerId } as any;
    fight.method = input.method;
    fight.round = input.round;
    fight.duration = input.duration;

    const updated = await this.fightRepo.save(fight);
    await rankingQueue.add('recalculate', {});

    return {
      id: updated.id,
      eventId: updated.event.id,
      redCornerId: updated.redCorner.id,
      blueCornerId: updated.blueCorner.id,
      winnerId: updated.winner?.id ?? undefined,
      method: updated.method ?? undefined,
      round: updated.round ?? undefined,
      duration: updated.duration ?? undefined,
    };
  }

  // 📋 Получение списка всех боёв
  @Query(() => [FightOutput])
  async getFights(): Promise<FightOutput[]> {
    const fights = await this.fightRepo.find({
      relations: ['event', 'redCorner', 'blueCorner', 'winner'],
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
    }));
  }
}
