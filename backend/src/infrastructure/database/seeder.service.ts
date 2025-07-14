import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WeightClassOrm } from './typeorm/weight-class.orm-entity';
import { FighterOrm } from './typeorm/fighter.orm-entity';
import { EventOrm } from './typeorm/event.orm-entity';
import { FightOrm } from './typeorm/fight.orm-entity';
import { FightMethod } from '../../common/enums/fight-method.enum';

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
    if (existing.length > 0) return;

    // 1. Добавляем весовые категории
    const weightClasses = await this.weightRepo.save([
      { name: 'Flyweight', minWeight: 56, maxWeight: 57 },
      { name: 'Bantamweight', minWeight: 58, maxWeight: 61 },
      { name: 'Featherweight', minWeight: 62, maxWeight: 65 },
      { name: 'Lightweight', minWeight: 66, maxWeight: 70 },
      { name: 'Welterweight', minWeight: 71, maxWeight: 77 },
      { name: 'Middleweight', minWeight: 78, maxWeight: 84 },
      { name: 'Light Heavyweight', minWeight: 85, maxWeight: 93 },
      { name: 'Heavyweight', minWeight: 94, maxWeight: 120 },
    ]);

    // 2. Добавляем бойцов (по 2 на весовую категорию)
    const fighters: FighterOrm[] = [];

    for (let i = 0; i < weightClasses.length; i++) {
      const wc = weightClasses[i];
      const f1 = this.fighterRepo.create({
        fullName: `Fighter ${i + 1}A`,
        nickname: `The ${wc.name} A`,
        birthDate: new Date(`199${i}-01-01`),
        height: 170 + i,
        weight: wc.minWeight + 1,
        team: `Team ${i + 1}`,
        weightClass: wc,
      });

      const f2 = this.fighterRepo.create({
        fullName: `Fighter ${i + 1}B`,
        nickname: `The ${wc.name} B`,
        birthDate: new Date(`199${i}-02-01`),
        height: 171 + i,
        weight: wc.minWeight + 2,
        team: `Team ${i + 1}`,
        weightClass: wc,
      });

      fighters.push(f1, f2);
    }

    await this.fighterRepo.save(fighters);

    // 3. Добавляем событие
    const event = this.eventRepo.create({
      name: 'UFC Seeded Event',
      location: 'Madison Square Garden',
      date: new Date(),
    });
    await this.eventRepo.save(event);

    // 4. Добавляем бои: каждый боец A дерется с бойцом B
    const fights: FightOrm[] = [];

    for (let i = 0; i < fighters.length; i += 2) {
      const red = fighters[i];
      const blue = fighters[i + 1];

      const fight = this.fightRepo.create({
        event,
        redCorner: red,
        blueCorner: blue,
        weightClass: red.weightClass,
        winner: red,
        method: FightMethod.KO,
        round: 2,
        duration: '3:15',
        is_finished: true,
      });

      fights.push(fight);
    }

    await this.fightRepo.save(fights);

    console.log('✅ Seeder: Added 8 weight classes, 16 fighters, 8 fights!');
  }
}
