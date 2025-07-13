import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { FighterModule } from './api/fighters/fighter.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { EventModule } from './api/events/event.module';
import { FightModule } from './api/fights/fight.module';
import { RankingModule } from './api/rankings/rankings.module';

// TypeORM сущности
import { FighterOrm } from './infrastructure/database/typeorm/fighter.orm-entity';
import { EventOrm } from './infrastructure/database/typeorm/event.orm-entity';
import { FightOrm } from './infrastructure/database/typeorm/fight.orm-entity';
import { RankingOrm } from './infrastructure/database/typeorm/ranking.orm-entity';
import { WeightClassOrm } from './infrastructure/database/typeorm/weight-class.orm-entity';

// Seeder
import { SeederService } from './infrastructure/database/seeder.service';

// Пока оставим тестовый модуль, можно будет удалить позже
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') || '5432'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        synchronize: true, // только для DEV
        autoLoadEntities: true,
        entities: [FighterOrm, EventOrm, FightOrm, RankingOrm, WeightClassOrm],
      }),
    }),

    TypeOrmModule.forFeature([
      FighterOrm,
      EventOrm,
      FightOrm,
      RankingOrm,
      WeightClassOrm,
    ]),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),

    FighterModule,
    FightModule,
    EventModule,
    TestModule,
    RankingModule,
  ],
  providers: [
    SeederService,
    
  ],
})
export class AppModule {}
