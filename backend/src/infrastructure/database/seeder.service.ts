import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WeightClassOrm } from './typeorm/weight-class.orm-entity';
import { FighterOrm } from './typeorm/fighter.orm-entity';
import { EventOrm } from './typeorm/event.orm-entity';
import { FightOrm, FightMethod } from './typeorm/fight.orm-entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(WeightClassOrm)
    private readonly weightRepo: Repository<WeightClassOrm>,
    @InjectRepository(FighterOrm)
    private readonly fighterRepo: Repository<FighterOrm>,
    @InjectRepository(EventOrm)
    private readonly eventRepo: Repository<EventOrm>,
    @InjectRepository(FightOrm)
    private readonly fightRepo: Repository<FightOrm>,
  ) {}

  async onApplicationBootstrap() {
    const existing = await this.fighterRepo.find();
    if (existing.length > 0) return; // уже есть данные

    // 1. Весовая категория
    const lightweight = this.weightRepo.create({
      name: 'Lightweight',
      minWeight: 65,
      maxWeight: 70,
    });
    await this.weightRepo.save(lightweight);

    // 2. Бойцы
    const fighter1 = this.fighterRepo.create({
      fullName: 'John Smith',
      nickname: 'The Hammer',
      birthDate: new Date('1990-01-01'),
      height: 180,
      weight: 69,
      team: 'Team Alpha',
      weightClass: lightweight,
    });
    const fighter2 = this.fighterRepo.create({
      fullName: 'Mike Johnson',
      nickname: 'Iron Mike',
      birthDate: new Date('1992-03-15'),
      height: 178,
      weight: 68,
      team: 'Team Omega',
      weightClass: lightweight,
    });
    await this.fighterRepo.save([fighter1, fighter2]);

    // 3. Событие
    const event = this.eventRepo.create({
      name: 'MMA Fight Night',
      location: 'Las Vegas Arena',
      date: new Date(),
    });
    await this.eventRepo.save(event);

    // 4. Бой
    const fight = this.fightRepo.create({
      event,
      redCorner: fighter1,
      blueCorner: fighter2,
      winner: fighter1,
      method: FightMethod.KO,
      round: 2,
      duration: '2:45',
    });
    await this.fightRepo.save(fight);

    console.log('✅ Seeder: Data added!');
  }
}
