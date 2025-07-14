import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { FighterOrm } from './fighter.orm-entity';
import { WeightClassOrm } from './weight-class.orm-entity';

@Entity('rankings')
export class RankingOrm {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FighterOrm)
  @JoinColumn({ name: 'fighter_id' })
  fighter: FighterOrm;

  @ManyToOne(() => WeightClassOrm)
  @JoinColumn({ name: 'weight_class_id' })
  weightClass: WeightClassOrm;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  losses: number;

  @Column({ default: 0 })
  draws: number;

  @Column({ type: 'timestamp', nullable: true })
  lastFightDate: Date | null;

  @Column({ type: 'int', nullable: true })
  rank_position: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
