import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';
import { StanceType } from '../../../common/enums/stance-type.enum';

@ObjectType()
export class FighterOutput {
  @Field(() => Int)
  id: number;

  @Field()
  fullName: string;

  @Field()
  nickname: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  birthDate: Date | null;

  @Field(() => Float)
  height: number;

  @Field(() => Float)
  weight: number;

  @Field()
  team: string;

  @Field(() => Int)
  weightClassId: number;

  @Field({ nullable: true })
  country?: string;

  @Field(() => Int, { nullable: true })
  reach_cm?: number;

  @Field(() => StanceType, { nullable: true })
  stance?: StanceType;

  @Field(() => GraphQLISODateTime)
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  updated_at: Date;
}
