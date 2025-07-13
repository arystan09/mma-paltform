import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('weight_classes')
export class WeightClassOrm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  minWeight: number;

  @Column()
  maxWeight: number;
}
