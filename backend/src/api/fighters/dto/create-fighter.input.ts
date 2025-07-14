import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { StanceType } from '../../../common/enums/stance-type.enum';

@InputType()
export class CreateFighterInput {
  @Field()
  fullName: string;

  @Field()
  nickname: string;

  @Field()
  birthDate: string;

  @Field(() => Float)
  height: number;

  @Field(() => Float)
  weight: number;

  @Field()
  team: string;

  @Field(() => Int)
  weightClassId: number;

  @Field({ nullable: true })
  country?: string;

  @Field(() => Float, { nullable: true })
  reach_cm?: number;

  @Field(() => StanceType, { nullable: true })
  stance?: StanceType;
}
