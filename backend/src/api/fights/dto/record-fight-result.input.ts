import { InputType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { FightMethod } from 'infrastructure/database/typeorm/fight.orm-entity';

registerEnumType(FightMethod, {
  name: 'FightMethod',
});

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

