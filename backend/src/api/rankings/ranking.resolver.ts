import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { RankingOrm } from 'infrastructure/database/typeorm/ranking.orm-entity';
import { RankingOutput } from './dto/ranking.output';
import { CalculateRankingUseCase } from '../../application/rankings/calculate-ranking.usecase';

@Resolver(() => RankingOutput)
export class RankingResolver {
  constructor(
    @InjectRepository(RankingOrm)
    private readonly rankingRepo: Repository<RankingOrm>,

    private readonly dataSource: DataSource,
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
      id: r.id.toString(),
      fighterId: r.fighter.id,
      fighterName: r.fighter.fullName,
      weightClassId: r.weightClass.id,
      weightClassName: r.weightClass.name,
      points: r.points,
      wins: r.wins,
      losses: r.losses,
      draws: r.draws,
      rankPosition: r.rank_position ?? undefined,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
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
      id: r.id.toString(),
      fighterId: r.fighter.id,
      fighterName: r.fighter.fullName,
      weightClassId: r.weightClass.id,
      weightClassName: r.weightClass.name,
      points: r.points,
      wins: r.wins,
      losses: r.losses,
      draws: r.draws,
      rankPosition: r.rank_position ?? undefined,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  /**
   * Мутация: ручной пересчёт рейтингов
   */
  @Mutation(() => Boolean, { description: 'Пересчитать рейтинги вручную' })
  async recalculateRankings(): Promise<boolean> {
    const usecase = new CalculateRankingUseCase(this.dataSource);
    await usecase.execute();
    return true;
  }
}
