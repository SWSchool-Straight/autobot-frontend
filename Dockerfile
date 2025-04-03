# Node.js 버전을 20으로 변경 (linux/amd64 플랫폼 지정)
FROM --platform=linux/amd64 node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 yarn.lock 복사
COPY package.json yarn.lock ./

# 의존성 설치
RUN yarn install --frozen-lockfile

# 소스 코드 복사
COPY . .

# 프로덕션용 빌드
RUN yarn build

# Nginx 이미지 사용 (linux/amd64 플랫폼 지정)
FROM --platform=linux/amd64 nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일을 Nginx의 서빙 디렉토리로 복사
COPY --from=0 /app/dist /usr/share/nginx/html

# 80 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"] 