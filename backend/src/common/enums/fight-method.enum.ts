import { registerEnumType } from '@nestjs/graphql';

export enum FightMethod {
  KO = 'KO',
  TKO = 'TKO',
  SUBMISSION = 'SUBMISSION',
  DECISION = 'DECISION',
  DQ = 'DQ',
  DRAW = 'DRAW',
}

registerEnumType(FightMethod, { name: 'FightMethod' });
