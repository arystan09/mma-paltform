import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateFightInput {
  @Field(() => Int)
  eventId: number;

  @Field(() => Int)
  redCornerId: number;

  @Field(() => Int)
  blueCornerId: number;

  @Field(() => Int)
  weightClassId: number;
}
