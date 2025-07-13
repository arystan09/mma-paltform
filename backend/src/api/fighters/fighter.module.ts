import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FighterOrm } from 'infrastructure/database/typeorm/fighter.orm-entity';
import { FightOrm } from 'infrastructure/database/typeorm/fight.orm-entity';
import { FighterResolver } from './fighter.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([FighterOrm, FightOrm])],
  providers: [FighterResolver],
})
export class FighterModule {}
