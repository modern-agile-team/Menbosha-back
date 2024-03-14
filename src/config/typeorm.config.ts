import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config({ path: '.env.production' });
config({ path: '.env.development', override: true });
config({ path: '.env.local', override: true });

export default new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/entities/*{.ts,.js}'],
  migrationsTableName: 'migrations', // migration 이력을 저장하는 테이블
  migrations: ['./src/migrations/**/[0-9]*.ts'], // migration 할 파일들이 있는 directory
});
