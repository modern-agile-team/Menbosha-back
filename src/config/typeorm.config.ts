import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

// .env 파일 로드
dotenv.config();

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

export const TypeORMconfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/entities/*{.ts,.js}'],
  subscribers: ['dist/**/subscribers/*{.ts,.js}'],
  timezone: '+00:00',
  synchronize: false, // DB 동기화 여부 설정
  logging: false, //DB 로깅 여부 설정
};
