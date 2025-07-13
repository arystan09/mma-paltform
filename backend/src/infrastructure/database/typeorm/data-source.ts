import { DataSource } from 'typeorm';
import { databaseConfig } from '../../../config/database.config';
import { FighterOrm } from './fighter.orm-entity';
import { FightOrm } from './fight.orm-entity';
import { RankingOrm } from './ranking.orm-entity';
import { EventOrm } from './event.orm-entity';
import { WeightClassOrm } from './weight-class.orm-entity';

export const AppDataSource = new DataSource({
  ...databaseConfig,
  entities: [FighterOrm, FightOrm, RankingOrm, EventOrm, WeightClassOrm],
});
