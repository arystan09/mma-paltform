import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FightResolver } from './fight.resolver';
import { FightOrm } from 'infrastructure/database/typeorm/fight.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([FightOrm])],
  providers: [FightResolver],
})
export class FightModule {}
