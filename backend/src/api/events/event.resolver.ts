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

    return {
      id: saved.id.toString(),
      name: saved.name,
      location: saved.location,
      date: saved.date,
      createdAt: saved.created_at,
      updatedAt: saved.updated_at,
    };
  }

  @Query(() => [EventOutput])
  async getEvents(): Promise<EventOutput[]> {
    const events = await this.eventRepo.find();
    return events.map(e => ({
      id: e.id.toString(),
      name: e.name,
      location: e.location,
      date: e.date,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    }));
  }

  @Query(() => EventOutput, { nullable: true, description: 'Получить событие по ID' })
  async getEventById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<EventOutput | null> {
    const event = await this.eventRepo.findOneBy({ id });

    if (!event) return null;

    return {
      id: event.id.toString(),
      name: event.name,
      location: event.location,
      date: event.date,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
    };
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
      isFinished: f.is_finished,
      weightClassId: f.weightClass.id,
      createdAt: f.created_at,
      updatedAt: f.updated_at,
    }));
  }
}
