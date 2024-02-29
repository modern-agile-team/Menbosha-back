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

# # redis.conf에서 쓰는 외부 acl파일(접근허용관련) 컨테이너 내부에 추가
# COPY users.acl /usr/local/etc/redis/users.acl

# # redis 실행
# CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]

# # redis를 실행할 포트
# EXPOSE 6379

# #nginx 이미지 사용
# FROM nginx:latest

# #nignx와 certbot 설치
# RUN apt-get update && apt-get install -y certbot python3-certbot-nginx

# #nginx.conf(설정파일 복사)
# COPY nginx.conf /etc/nginx/nginx.conf

# #port
# EXPOSE 80
# EXPOSE 443

# #entrypoint.sh 복사, 권한부여
# COPY entrypoint.sh /entrypoint.sh
# RUN chmod +x /entrypoint.sh

# #컨테이너가 실행될 때 entrypoint.sh 실행
# CMD ["/entrypoint.sh"]
