import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class EventOutput {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  location: string;

  @Field()
  date: Date;
}
