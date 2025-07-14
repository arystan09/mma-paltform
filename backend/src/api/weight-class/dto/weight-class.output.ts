import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class WeightClassOutput {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int)
  minWeight: number;

  @Field(() => Int)
  maxWeight: number;
}
