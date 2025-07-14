import { registerEnumType } from '@nestjs/graphql';

export enum StanceType {
  ORTHODOX = 'orthodox',
  SOUTHPAW = 'southpaw',
  SWITCH = 'switch',
  OPEN = 'open',
}

registerEnumType(StanceType, { name: 'StanceType' });
