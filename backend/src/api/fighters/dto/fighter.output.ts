import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class FighterOutput {
  @Field(() => Int)
  id: number;

  @Field()
  fullName: string;

  @Field()
  nickname: string;

  @Field()
  birthDate: Date;

  @Field(() => Float)
  height: number;

  @Field(() => Float)
  weight: number;

  @Field()
  team: string;

  @Field(() => Int)
  weightClassId: number;
}
