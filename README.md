# 🚗 오토봇 (AUTOBOT)

중고차 통합 검색 챗봇 서비스, 오토봇의 프론트엔드 웹 페이지입니다.

<br/>

## 📝 프로젝트 소개

오토봇은 사용자가 자연어로 중고차를 검색하고 추천받을 수 있는 AI 기반 챗봇 서비스입니다. 복잡한 중고차 검색 과정을 대화형 인터페이스로 단순화하여 사용자 경험을 개선했습니다.

### 주요 기능

- 🤖 자연어 기반 중고차 검색
- 💬 대화형 인터페이스로 차량 추천
- 🔍 상세한 차량 정보 제공 (외부/내부 색상, 주행거리, 차량번호 등)
- 💰 시세 비교 기능 (특가/할인가/적정가/고가/프리미엄)
- 👤 회원 관리 시스템
- 📜 로그인 사용자 대화 기록 저장

<br/>

## 🛠 기술 스택

### 프론트엔드
- React + TypeScript
- Vite
- Material-UI
- Axios
- CSS Modules

### 인프라
- AWS S3 + CloudFront
- GitLab CI/CD
- Docker

<br/>


## 🏗 프로젝트 구조

```
src/
├── api/        # API 클라이언트 및 통신 관련
├── assets/     # 이미지, 아이콘 등 정적 파일
├── components/ # 재사용 가능한 컴포넌트
├── contexts/   # React Context
├── pages/      # 페이지 컴포넌트
├── services/   # 비즈니스 로직
├── styles/     # CSS 스타일
├── types/      # TypeScript 타입 정의
└── utils/      # 유틸리티 함수
```

<br/>


## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone [repository-url]
```

### 2. 의존성 설치
```bash
yarn install
```

### 3. 환경 변수 설정
```bash
VITE_CHAT_BASE_URL=your_chat_api_url
VITE_AUTH_BASE_URL=your_auth_api_url
```

### 4. 개발 서버 실행
```bash
yarn dev
```

### 🐳 Docker로 실행하기

1. Docker 이미지 다운로드
```bash
docker pull bestlalala/autobot-app:1.0.1
```

> ⚠️ 이 이미지는 linux/amd64 아키텍처에 최적화되어 있습니다. 
> Apple Silicon(M1/M2) Mac 사용자는 Rosetta 2를 통해 실행되며, 성능 저하가 있을 수 있습니다.
> bestlalala/autobot-app:1.0.0 이미지는 linux/arm64/v8 아키텍처에 최적화되어 있습니다.


2. Docker Compose로 실행
```yaml
# docker-compose.yml 파일 생성
version: '3.8'
services:
  frontend:
    image: bestlalala/autobot-app:1.0.1
    platform: linux/amd64 
    ports:
      - "80:80"
    environment:
      - VITE_AUTH_BASE_URL=http://localhost:8080
      - VITE_CHAT_BASE_URL=http://localhost:8080
    depends_on:
      - app
```

3. 실행
```bash
docker-compose up -d
```

### 환경변수 설정
| 변수명 | 설명 | 기본값 |
|--------|------|---------|
| VITE_AUTH_BASE_URL | 인증 API 서버 주소 | http://localhost:8080 |
| VITE_CHAT_BASE_URL | 채팅 API 서버 주소 | http://localhost:8080 |

<br/>

## 🏗 프로젝트 구조

```
src/
├── api/        # API 클라이언트 및 통신 관련
├── assets/     # 이미지, 아이콘 등 정적 파일
├── components/ # 재사용 가능한 컴포넌트
├── contexts/   # React Context
├── pages/      # 페이지 컴포넌트
├── services/   # 비즈니스 로직
├── styles/     # CSS 스타일
├── types/      # TypeScript 타입 정의
└── utils/      # 유틸리티 함수
```

<br/>

## 🔒 보안 및 인증

- JWT 기반 인증 시스템
- Access Token & Refresh Token 활용
- 로그인/로그아웃 상태 관리
- 인증된 사용자 대화 기록 저장

<br/>

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

<br/>

