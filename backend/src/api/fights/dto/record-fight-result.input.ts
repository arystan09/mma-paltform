import { InputType, Field, Int } from '@nestjs/graphql';
import { FightMethod } from '../../../common/enums/fight-method.enum';

@InputType()
export class RecordFightResultInput {
  @Field(() => Int)
  fightId: number;

  @Field(() => Int)
  winnerId: number;

  @Field(() => FightMethod)
  method: FightMethod;

  @Field(() => Int)
  round: number;

  @Field()
  duration: string;
}
