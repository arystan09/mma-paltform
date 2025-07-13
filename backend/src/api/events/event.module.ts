import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventOrm } from 'infrastructure/database/typeorm/event.orm-entity';
import { FightOrm } from 'infrastructure/database/typeorm/fight.orm-entity';

import { EventResolver } from './event.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([EventOrm, FightOrm])],
  providers: [EventResolver],
})
export class EventModule {}
