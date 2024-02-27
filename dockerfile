# # Node.js 버전을 기반으로 하는 도커 이미지 사용
# FROM node:18.16.0-alpine AS build

# # 작업 디렉토리 설정
# WORKDIR /home/app

# # 작업 디렉토리에 내용 복사
# COPY package*.json ./

# RUN npm ci --only=production && npm cache clean --force

# # /dist 폴더를 이미지에 복사
# COPY ./dist ./dist

# # 애플리케이션 실행
# CMD ["npm", "run", "start:prod"]

# # 애플리케이션을 실행할 포트
# EXPOSE 3000


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

#ngnix이미지 최신버전
FROM nginx:latest

# Install certbot
RUN apt-get update && \
    apt-get install -y certbot && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy certbot script
COPY certbot_script.sh /usr/local/bin/certbot_script.sh

# Set execute permission for certbot script
RUN chmod +x /usr/local/bin/certbot_script.sh

# 80- http 443- https
EXPOSE 80
EXPOSE 443

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"]

# cerbot 시작
RUN /usr/local/bin/certbot_script.sh
