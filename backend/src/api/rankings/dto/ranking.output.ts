import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class RankingOutput {
  @Field(() => ID)
  id: string;

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

  @Field(() => Int, { nullable: true })
  rankPosition?: number;

  // Временные метки
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
