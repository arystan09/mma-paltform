import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class FighterStatsOutput {
  @Field(() => Int)
  totalFights: number;

  @Field(() => Int)
  wins: number;

  @Field(() => Int)
  losses: number;

  @Field(() => Int)
  draws: number;

  @Field(() => Int)
  koWins: number;

  @Field(() => Int)
  submissionWins: number;

  @Field(() => Int)
  decisionWins: number;

  @Field(() => Number)
  winRate: number;

  @Field(() => Int, { nullable: true })
  lastFightId?: number;

  @Field(() => [Int])
  fightIds: number[];
}
