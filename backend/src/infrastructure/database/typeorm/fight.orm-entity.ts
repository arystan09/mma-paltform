import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { FighterOrm } from './fighter.orm-entity';
import { EventOrm } from './event.orm-entity';
import { WeightClassOrm } from './weight-class.orm-entity';
import { FightMethod } from '../../../common/enums/fight-method.enum';

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

  @ManyToOne(() => WeightClassOrm)
  @JoinColumn({ name: 'weight_class_id' })
  weightClass: WeightClassOrm;

  @Column({ default: false })
  is_finished: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
