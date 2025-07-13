import { Module } from '@nestjs/common';
import { EventResolver } from './event.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventOrm } from 'infrastructure/database/typeorm/event.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventOrm])],
  providers: [EventResolver],
})
export class EventModule {}
