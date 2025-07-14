import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventOrm } from 'infrastructure/database/typeorm/event.orm-entity';
import { FightOrm } from 'infrastructure/database/typeorm/fight.orm-entity';

import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
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

  // Создание события
  @Mutation(() => EventOutput)
  async createEvent(@Args('input') input: CreateEventInput): Promise<EventOutput> {
    const saved = await this.eventRepo.save({
      ...input,
      date: new Date(input.date),
    });

    return this.toOutput(saved);
  }

  // Получение всех событий
  @Query(() => [EventOutput])
  async getEvents(): Promise<EventOutput[]> {
    const events = await this.eventRepo.find();
    return events.map(this.toOutput);
  }

  // Получение события по ID
  @Query(() => EventOutput, { nullable: true, description: 'Получить событие по ID' })
  async getEventById(@Args('id', { type: () => Int }) id: number): Promise<EventOutput | null> {
    const event = await this.eventRepo.findOneBy({ id });
    return event ? this.toOutput(event) : null;
  }

  // Обновление события
  @Mutation(() => EventOutput)
  async updateEvent(@Args('input') input: UpdateEventInput): Promise<EventOutput> {
    const event = await this.eventRepo.findOneBy({ id: input.id });
    if (!event) throw new Error(`Event with ID ${input.id} not found`);

    Object.assign(event, input);
    if (input.date) {
      event.date = new Date(input.date);
    }

    const updated = await this.eventRepo.save(event);
    return this.toOutput(updated);
  }

  // Удаление события
  @Mutation(() => Boolean, { description: 'Delete event by ID' })
  async deleteEvent(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    const relatedFights = await this.fightRepo.count({
      where: { event: { id } },
    });

    if (relatedFights > 0) {
      throw new Error('Unable to delete event: battles are linked to it.');
    }

    const result = await this.eventRepo.delete(id);

    return result.affected !== 0;
  }

  // Получение fight card (всех боёв события)
  @Query(() => [FightOutput])
  async getEventFightCard(@Args('eventId', { type: () => Int }) eventId: number): Promise<FightOutput[]> {
    const fights = await this.fightRepo.find({
      where: { event: { id: eventId } },
      relations: ['event', 'redCorner', 'blueCorner', 'winner', 'weightClass'],
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

  private toOutput(event: EventOrm): EventOutput {
    return {
      id: event.id.toString(),
      name: event.name,
      location: event.location,
      date: event.date,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
    };
  }
}
