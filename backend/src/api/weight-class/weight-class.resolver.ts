import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WeightClassOrm } from 'infrastructure/database/typeorm/weight-class.orm-entity';
import { WeightClassOutput } from './dto/weight-class.output';

@Resolver(() => WeightClassOutput)
export class WeightClassResolver {
  constructor(
    @InjectRepository(WeightClassOrm)
    private readonly repo: Repository<WeightClassOrm>,
  ) {}

  /** Получить весовую категорию по ID */
  @Query(() => WeightClassOutput, { name: 'getWeightClassById' })
  async getById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<WeightClassOutput> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new Error(`Weight class with ID ${id} not found`);

    return {
      id: item.id,
      name: item.name,
      minWeight: item.minWeight,
      maxWeight: item.maxWeight,  
    };
  }

  /** Получить все весовые категории */
  @Query(() => [WeightClassOutput], { name: 'getAllWeightClasses' })
  async getAllWeightClasses(): Promise<WeightClassOutput[]> {
    const list = await this.repo.find();

    return list.map(item => ({
      id: item.id,
      name: item.name,
      minWeight: item.minWeight,   
      maxWeight: item.maxWeight, 
    }));
  }
}
