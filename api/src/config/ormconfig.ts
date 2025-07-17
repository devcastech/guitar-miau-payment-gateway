import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load .env file only for TypeORM CLI operations (migrations)
dotenv.config();

export const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'userpassword',
  database: process.env.DB_NAME || 'paymentgateway',
  synchronize: true,
  migrationsRun: true,
  logging: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
};
