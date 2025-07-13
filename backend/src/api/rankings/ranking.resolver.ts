import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RankingOrm } from 'infrastructure/database/typeorm/ranking.orm-entity';
import { RankingOutput } from './dto/ranking.output';

@Resolver(() => RankingOutput)
export class RankingResolver {
  constructor(
    @InjectRepository(RankingOrm)
    private readonly rankingRepo: Repository<RankingOrm>,
  ) {}

  /**
   * Получение рейтингов бойцов по весовой категории
   */
  @Query(() => [RankingOutput], { description: 'Получить рейтинг бойцов по вес-категории' })
  async rankingsByWeightClass(
    @Args('weightClassId', { type: () => Int }) weightClassId: number,
  ): Promise<RankingOutput[]> {
    const data = await this.rankingRepo.find({
      where: { weightClass: { id: weightClassId } },
      relations: ['fighter', 'weightClass'],
      order: { points: 'DESC' },
    });

    return data.map(r => ({
      id: r.id,
      fighterId: r.fighter.id,
      fighterName: r.fighter.fullName,
      weightClassId: r.weightClass.id,
      weightClassName: r.weightClass.name,
      points: r.points,
      wins: r.wins,
      losses: r.losses,
      draws: r.draws,
      lastFightDate: r.lastFightDate,
    }));
  }

  /**
   * Получить ТОП-10 бойцов по общему рейтингу
   */
  @Query(() => [RankingOutput], { description: 'ТОП-10 бойцов с наибольшим рейтингом' })
  async topRankedFighters(): Promise<RankingOutput[]> {
    const data = await this.rankingRepo.find({
      relations: ['fighter', 'weightClass'],
      order: { points: 'DESC' },
      take: 10,
    });

    return data.map(r => ({
      id: r.id,
      fighterId: r.fighter.id,
      fighterName: r.fighter.fullName,
      weightClassId: r.weightClass.id,
      weightClassName: r.weightClass.name,
      points: r.points,
      wins: r.wins,
      losses: r.losses,
      draws: r.draws,
      lastFightDate: r.lastFightDate,
    }));
  }
}
