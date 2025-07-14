import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';
import { FightMethod } from '../../../common/enums/fight-method.enum';

@ObjectType()
export class FightOutput {
  @Field(() => ID)
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

  @Field(() => Boolean)
  isFinished: boolean;

  @Field(() => Int)
  weightClassId: number;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
