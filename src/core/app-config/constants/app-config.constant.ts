const RDB = {
  DATABASE_HOST: 'DATABASE_HOST',
  DATABASE_PORT: 'DATABASE_PORT',
  DATABASE_USER: 'DATABASE_USER',
  DATABASE_PASSWORD: 'DATABASE_PASSWORD',
  DATABASE_NAME: 'DATABASE_NAME',
} as const;

const MONGO = {
  MONGO_URI: 'MONGO_URI',
} as const;

const OAUTH = {
  NAVER_CLIENT_ID: 'NAVER_CLIENT_ID',
  NAVER_CLIENT_SECRET: 'NAVER_CLIENT_SECRET',
  NAVER_REDIRECT_URI: 'NAVER_REDIRECT_URI',

  KAKAO_CLIENT_ID: 'KAKAO_CLIENT_ID',
  KAKAO_REDIRECT_URI: 'KAKAO_REDIRECT_URI',

  GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_ID',
  GOOGLE_CLIENT_SECRET: 'GOOGLE_CLIENT_SECRET',
  GOOGLE_REDIRECT_URI: 'GOOGLE_REDIRECT_URI',
} as const;

const JWT = {
  JWT_SECRET_KEY: 'JWT_SECRET_KEY',
  JWT_ACCESS_TOKEN_SECRET_KEY: 'JWT_ACCESS_TOKEN_SECRET_KEY',
  JWT_REFRESH_TOKEN_SECRET_KEY: 'JWT_REFRESH_TOKEN_SECRET_KEY',
} as const;

const AWS = {
  AWS_S3_URL: 'AWS_S3_URL',
  AWS_S3_BUCKET: 'AWS_S3_BUCKET',
  AWS_ACCESS_KEY: 'AWS_ACCESS_KEY',
  AWS_SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
  AWS_S3_REGION: 'AWS_S3_REGION',
} as const;

const DEFAULT = {
  DEFAULT_USER_IMAGE: 'DEFAULT_USER_IMAGE',
} as const;

const REDIS = {
  REDIS_PASSWORD: 'REDIS_PASSWORD',
  REDIS_HOST: 'REDIS_HOST',
  REDIS_PORT: 'REDIS_PORT',
} as const;

const FRONT = {
  FRONT_PRODUCTION_DOMAIN: 'FRONT_PRODUCTION_DOMAIN',
  FRONT_PRODUCTION_WWW_DOMAIN: 'FRONT_PRODUCTION_WWW_DOMAIN',
  FRONT_DEVELOPMENT_DOMAIN: 'FRONT_DEVELOPMENT_DOMAIN',
  FRONT_LOCAL_DOMAIN: 'FRONT_LOCAL_DOMAIN',
} as const;

export const ENV_KEY = {
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  ...AWS,
  ...DEFAULT,
  ...FRONT,
  ...JWT,
  ...MONGO,
  ...OAUTH,
  ...RDB,
  ...REDIS,
} as const;
