import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RankingOutput {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  fighterId: number;

  @Field()
  fighterName: string;

  @Field(() => Int)
  weightClassId: number;

  @Field()
  weightClassName: string;

  @Field(() => Int)
  points: number;

  @Field(() => Int)
  wins: number;

  @Field(() => Int)
  losses: number;

  @Field(() => Int)
  draws: number;

  @Field(() => Date, { nullable: true })
  lastFightDate: Date | null;

}
