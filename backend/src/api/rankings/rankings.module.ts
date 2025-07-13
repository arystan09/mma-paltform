import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankingResolver } from './ranking.resolver';
import { RankingOrm } from 'infrastructure/database/typeorm/ranking.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([RankingOrm])],
  providers: [RankingResolver],
})
export class RankingModule {}
