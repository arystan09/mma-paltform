import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('events')
export class EventOrm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  date: Date;
}
