import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`❌ Environment variable ${name} is not set`);
  }
  return value;
}

export const databaseConfig = {
  type: 'postgres' as const,
  host: getEnvVar('DB_HOST', 'localhost'),
  port: parseInt(getEnvVar('DB_PORT', '5432'), 10),
  username: getEnvVar('DB_USERNAME', 'mma'),
  password: getEnvVar('DB_PASSWORD', 'mma123'),
  database: getEnvVar('DB_DATABASE', 'mma_db'),
  synchronize: true,
};
