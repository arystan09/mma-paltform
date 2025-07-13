import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class FighterStatsOutput {
  @Field(() => Int)
  fighterId: number;

  @Field(() => Int)
  wins: number;

  @Field(() => Int)
  losses: number;

  @Field(() => Int)
  draws: number;
}
