import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { WeightClassOrm } from './weight-class.orm-entity';

@Entity('fighters')
export class FighterOrm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  nickname: string;

  @Column()
  birthDate: Date;

  @Column()
  height: number;

  @Column()
  weight: number;

  @Column()
  team: string;

  @ManyToOne(() => WeightClassOrm)
  @JoinColumn({ name: 'weight_class_id' })
  weightClass: WeightClassOrm;

  @RelationId((fighter: FighterOrm) => fighter.weightClass)
  weightClassId: number;
}
