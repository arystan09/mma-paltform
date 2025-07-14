import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateFighterInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  fullName?: string;

  @Field({ nullable: true })
  nickname?: string;

  @Field({ nullable: true })
  team?: string;

  @Field(() => Int, { nullable: true })
  height?: number;

  @Field(() => Int, { nullable: true })
  weight?: number;

  @Field(() => Int, { nullable: true })
  weightClassId?: number;

  @Field({ nullable: true })
  birthDate?: string;
}
