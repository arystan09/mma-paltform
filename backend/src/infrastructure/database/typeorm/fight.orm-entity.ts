import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FighterOrm } from './fighter.orm-entity';
import { EventOrm } from './event.orm-entity';

export enum FightMethod {
  KO = 'KO',
  SUBMISSION = 'SUBMISSION',
  DECISION = 'DECISION',
  DRAW = 'DRAW',
}

@Entity('fights')
export class FightOrm {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => EventOrm)
  @JoinColumn({ name: 'event_id' })
  event: EventOrm;

  @ManyToOne(() => FighterOrm)
  @JoinColumn({ name: 'red_corner_id' })
  redCorner: FighterOrm;

  @ManyToOne(() => FighterOrm)
  @JoinColumn({ name: 'blue_corner_id' })
  blueCorner: FighterOrm;

  @ManyToOne(() => FighterOrm, { nullable: true })
  @JoinColumn({ name: 'winner_id' })
  winner: FighterOrm;

  @Column({ type: 'enum', enum: FightMethod, nullable: true })
  method: FightMethod;

  @Column({ nullable: true })
  round: number;

  @Column({ nullable: true })
  duration: string;
}
