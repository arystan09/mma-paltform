import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { FightMethod } from 'infrastructure/database/typeorm/fight.orm-entity';

registerEnumType(FightMethod, {
  name: 'FightMethod',
});

@ObjectType()
export class FightOutput {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  eventId: number;

  @Field(() => Int)
  redCornerId: number;

  @Field(() => Int)
  blueCornerId: number;

  @Field(() => Int, { nullable: true })
  winnerId?: number;

  @Field(() => FightMethod, { nullable: true })
  method?: FightMethod;

  @Field({ nullable: true })
  duration?: string;

  @Field({ nullable: true })
  round?: number;
}
