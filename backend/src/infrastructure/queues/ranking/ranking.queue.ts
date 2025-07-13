import { Queue } from 'bullmq';
import { config } from 'dotenv';

config(); // Чтобы .env подгрузить

export const rankingQueue = new Queue('ranking', {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});
