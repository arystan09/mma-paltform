import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateFighterInput {
  @Field()
  fullName: string;

  @Field()
  nickname: string;

  @Field()
  birthDate: string; // Можно также Date

  @Field(() => Float)
  height: number;

  @Field(() => Float)
  weight: number;

  @Field()
  team: string;

  @Field(() => Int)
  weightClassId: number;
}
