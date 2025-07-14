import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { WeightClassOrm } from './weight-class.orm-entity';
import { StanceType } from '../../../common/enums/stance-type.enum';


@Entity('fighters')
export class FighterOrm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  nickname: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column()
  height: number;

  @Column()
  weight: number;

  @Column()
  team: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  reach_cm: number;

  @Column({
    type: 'enum',
    enum: StanceType,
    default: StanceType.ORTHODOX,
  })
  stance: StanceType;

  @ManyToOne(() => WeightClassOrm)
  @JoinColumn({ name: 'weight_class_id' })
  weightClass: WeightClassOrm;

  @RelationId((fighter: FighterOrm) => fighter.weightClass)
  weightClassId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
