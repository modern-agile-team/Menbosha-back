# Node.js 버전을 기반으로 하는 도커 이미지 사용
FROM node:18.16.0-alpine AS build

# 작업 디렉토리 설정
WORKDIR /home/app

# 작업 디렉토리에 내용 복사
COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

# /dist 폴더를 이미지에 복사
COPY ./dist ./dist

# 애플리케이션 실행
CMD ["npm", "run", "start:prod"]

# 애플리케이션을 실행할 포트
EXPOSE 3000


# # redis 이미지 사용
# FROM redis:6.2.6-alpine AS redis

# # 작업 디렉토리 설정
# WORKDIR /usr/local/etc/redis/

# # redis.conf 파일을 이미지에 복사
# COPY redis.conf /usr/local/etc/redis/redis.conf

# # redis 실행
# CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]

# # redis를 실행할 포트
# EXPOSE 6379