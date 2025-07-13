import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventOrm } from 'infrastructure/database/typeorm/event.orm-entity';
import { FightOrm } from 'infrastructure/database/typeorm/fight.orm-entity';

import { CreateEventInput } from './dto/create-event.input';
import { EventOutput } from './dto/event.output';
import { FightOutput } from '../fights/dto/fight.output';

@Resolver(() => EventOutput)
export class EventResolver {
  constructor(
    @InjectRepository(EventOrm)
    private readonly eventRepo: Repository<EventOrm>,

    @InjectRepository(FightOrm)
    private readonly fightRepo: Repository<FightOrm>,
  ) {}

  @Mutation(() => EventOutput)
  async createEvent(@Args('input') input: CreateEventInput): Promise<EventOutput> {
    const saved = await this.eventRepo.save({
      ...input,
      date: new Date(input.date),
    });
    return saved;
  }

  @Query(() => [EventOutput])
  async getEvents(): Promise<EventOutput[]> {
    return this.eventRepo.find();
  }

  @Query(() => EventOutput, { nullable: true })
  async getEventById(@Args('id') id: number): Promise<EventOutput | null> {
    return this.eventRepo.findOneBy({ id });
  }

  @Query(() => [FightOutput])
  async getEventFightCard(
    @Args('eventId', { type: () => Int }) eventId: number,
  ): Promise<FightOutput[]> {
    const fights = await this.fightRepo.find({
      where: { event: { id: eventId } },
      relations: ['event', 'redCorner', 'blueCorner', 'winner'],
    });

    return fights.map(f => ({
      id: f.id,
      eventId: f.event.id,
      redCornerId: f.redCorner.id,
      blueCornerId: f.blueCorner.id,
      winnerId: f.winner?.id,
      method: f.method,
      round: f.round,
      duration: f.duration,
    }));
  }
}
