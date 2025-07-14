import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeightClassResolver } from './weight-class.resolver';
import { WeightClassOrm } from 'infrastructure/database/typeorm/weight-class.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([WeightClassOrm])],
  providers: [WeightClassResolver],
})
export class WeightClassModule {}
