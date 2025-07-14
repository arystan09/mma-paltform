import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class EventOutput {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  location: string;

  @Field(() => GraphQLISODateTime)
  date: Date;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
