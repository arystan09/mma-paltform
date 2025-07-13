import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { EventOrm } from 'infrastructure/database/typeorm/event.orm-entity';
import { Repository } from 'typeorm';
import { CreateEventInput } from './dto/create-event.input';
import { EventOutput } from './dto/event.output';

@Resolver(() => EventOutput)
export class EventResolver {
  constructor(
    @InjectRepository(EventOrm)
    private readonly eventRepo: Repository<EventOrm>,
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

  @Query(() => EventOutput, { nullable: true }) // GraphQL тоже уведомляется, что может быть null
   async getEventById(@Args('id') id: number): Promise<EventOutput | null> {
    return this.eventRepo.findOneBy({ id });
  }
}
