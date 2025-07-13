import { DataSource } from 'typeorm';
import { FighterOrm } from '../../infrastructure/database/typeorm/fighter.orm-entity';
import { FightOrm, FightMethod } from '../../infrastructure/database/typeorm/fight.orm-entity';
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
        relations: ['winner'],
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
  }
}
