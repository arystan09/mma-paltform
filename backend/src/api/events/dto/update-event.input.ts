import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateEventInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  date?: string;
}
