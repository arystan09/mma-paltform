import { DataSource } from 'typeorm';
import { FighterOrm } from '../../infrastructure/database/typeorm/fighter.orm-entity';
import { FightOrm } from '../../infrastructure/database/typeorm/fight.orm-entity';
import { FightMethod } from '../../common/enums/fight-method.enum';
import { RankingOrm } from '../../infrastructure/database/typeorm/ranking.orm-entity';

export class CalculateRankingUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(): Promise<void> {
    const fighterRepo = this.dataSource.getRepository(FighterOrm);
    const fightRepo = this.dataSource.getRepository(FightOrm);
    const rankingRepo = this.dataSource.getRepository(RankingOrm);

    const fighters = await fighterRepo.find({ relations: ['weightClass'] });

    for (const fighter of fighters) {
      const fights = await fightRepo.find({
        where: [
          { redCorner: { id: fighter.id } },
          { blueCorner: { id: fighter.id } },
        ],
        relations: ['winner', 'event'],
      });

      let wins = 0;
      let losses = 0;
      let draws = 0;
      let points = 0;
      let lastFightDate: Date | null = null;

      for (const fight of fights) {
        if (!fight.winner) continue;

        if (fight.winner.id === fighter.id) {
          wins++;
          if (fight.method === FightMethod.KO || fight.method === FightMethod.SUBMISSION) points += 4;
          else if (fight.method === FightMethod.DECISION) points += 3;
        } else {
          losses++;
        }

        if (fight.event?.date instanceof Date && !isNaN(fight.event.date.getTime())) {
          lastFightDate = fight.event.date;
        }
      }

      const existing = await rankingRepo.findOne({
        where: {
          fighter: { id: fighter.id },
          weightClass: { id: fighter.weightClass.id },
        },
        relations: ['fighter', 'weightClass'],
      });

      if (existing) {
        existing.points = points;
        existing.wins = wins;
        existing.losses = losses;
        existing.draws = draws;
        existing.lastFightDate = lastFightDate;
        await rankingRepo.save(existing);
      } else {
        const newRank = rankingRepo.create({
          fighter,
          weightClass: fighter.weightClass,
          points,
          wins,
          losses,
          draws,
          lastFightDate,
        });
        await rankingRepo.save(newRank);
      }
    }

    // Расчёт rank_position
    const allWeightClasses = await rankingRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.weightClass', 'weightClass')
      .leftJoinAndSelect('r.fighter', 'fighter')
      .getMany();

    // ❗ Гарантируем, что объекты "живые" и будут отслеживаться при сохранении
    for (const r of allWeightClasses) {
      if (!r.rank_position) {
        r.rank_position = null; // на всякий случай инициализация
      }
    }

    const groupedByClass: { [key: string]: RankingOrm[] } = {};

    for (const r of allWeightClasses) {
      const key = r.weightClass.id;
      if (!groupedByClass[key]) groupedByClass[key] = [];
      groupedByClass[key].push(r);
    }

    for (const group of Object.values(groupedByClass)) {
      const sorted = group.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (!a.lastFightDate || !b.lastFightDate) return 0;
        return b.lastFightDate.getTime() - a.lastFightDate.getTime();
      });

      for (let i = 0; i < sorted.length; i++) {
        sorted[i].rank_position = i + 1;
      }

      await rankingRepo.save(sorted);
    }
  }
}
