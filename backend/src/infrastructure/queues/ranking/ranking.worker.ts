import { Worker } from 'bullmq';
import { config } from 'dotenv';
import { CalculateRankingUseCase } from '../../../application/rankings/calculate-ranking.usecase';
import { AppDataSource } from '../../database/typeorm/data-source';

config();

console.log('🚀 Worker started and listening...');

const worker = new Worker(
  'ranking',
  async job => {
    try {
      // Инициализация подключения к БД
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log('🗃️  DataSource initialized');
      }

      // Запуск логики пересчёта рейтинга
      const usecase = new CalculateRankingUseCase(AppDataSource);
      console.log('🔧 Starting ranking calculation...');
      await usecase.execute();
      console.log('✅ Ranking recalculated');

    } catch (error) {
      console.error('❌ Error during ranking calculation:', error);
    }
  },
  {
    connection: {
      host: 'localhost',
      port: 6379,
    },
  },
);
