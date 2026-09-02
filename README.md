# 💡 ThinkPad - 풀스택 메모 & 아이디어 기록 플랫폼

> **ThinkPad**는 떠오르는 생각과 아이디어를 빠르고 아름답게 기록하고 관리할 수 있는 모던 풀스택(Web/Mobile) 애플리케이션입니다.  
> React 19, Tailwind CSS v4, daisyUI 5를 활용한 반응형 프론트엔드와 Express 5, MongoDB, Upstash Redis 기반의 안전하고 확장성 있는 백엔드로 구축되었습니다.

---

## 📑 목차 (Table of Contents)

1. [✨ 주요 서비스 및 핵심 기능](#-주요-서비스-및-핵심-기능)
2. [🛠️ 기술 스택 (Tech Stack)](#️-기술-스택-tech-stack)
3. [📁 프로젝트 구조 (Folder Structure)](#-프로젝트-구조-folder-structure)
4. [🔌 API 명세서 (API Endpoints)](#-api-명세서-api-endpoints)
5. [🚀 시작하기 (Getting Started)](#-시작하기-getting-started)
   - [1) 사전 요구사항](#1-사전-요구사항)
   - [2) 백엔드 (Backend) 설정 및 실행](#2-백엔드-backend-설정-및-실행)
   - [3) 프론트엔드 (Frontend) 설정 및 실행](#3-프론트엔드-frontend-설정-및-실행)
6. [💡 주요 작업 내용 및 핵심 구현 절차](#-주요-작업-내용-및-핵심-구현-절차)
   - [1. daisyUI 5 멀티 테마 시스템 (`Light`, `Dark`, `Forest`)](#1-daisyui-5-멀티-테마-시스템-light-dark-forest)
   - [2. Upstash Redis 기반 분산 Rate Limiting & 전용 UI 연동](#2-upstash-redis-기반-분산-rate-limiting--전용-ui-연동)
   - [3. Think(메모) CRUD 및 스마트 인터랙션](#3-think메모-crud-및-스마트-인터랙션)
7. [❓ 문제 해결 (Troubleshooting)](#-문제-해결-troubleshooting)

---

## ✨ 주요 서비스 및 핵심 기능

- 📝 **Think CRUD (생성·조회·수정·삭제)**
  - 아이디어 작성, 카드형 목록 조회, 상세 조회, 수정, 삭제 지원.
  - 생성 및 수정 시 실시간 검증(Validation) 및 알림 토스트(Toast) 제공.
- 🎨 **daisyUI 5 멀티 테마 전환**
  - **`Light` (밝은 테마)**, **`Dark` (어두운 테마)**, **`Forest` (자연 숲 테마)** 지원.
  - 선택한 테마를 `localStorage`에 영구 보관하며, 페이지 새로고침 시 깜빡임(FOUC) 방지 스크립트 내장.
- ⚡ **Upstash Redis 기반 Rate Limiting (요청 한도 제어)**
  - 분당 최대 100회 요청 제한(Sliding Window 알고리즘)으로 서버 과부하 및 악의적 공격 방지.
  - HTTP 429 발생 시 전용 알림 화면([`RateLimitedUI`](frontend/src/components/RateLimitedUI.jsx)) 자동 전환.
  - 실시간 대기 카운트다운 타이머, 프로그레스 바, 스마트 재시도 및 홈 이동 지원.
- 🔍 **디바운스(Debounce) 실시간 검색**
  - 불필요한 연산을 줄이기 위해 350ms 디바운스 적용 (2글자 이상 입력 시 즉시 필터링).
- 📱 **모바일 친화적 반응형 UI**
  - 모바일, 태블릿, 데스크톱 화면 크기에 맞춘 유연한 그리드 레이아웃.

---

## 🛠️ 기술 스택 (Tech Stack)

### Backend

| 구분 | 기술 / 라이브러리 | 용도 및 특징 |
| :--- | :--- | :--- |
| **Runtime** | `Node.js` (ES Modules) | 서버 런타임 환경 |
| **Framework** | `Express.js` (v5) | RESTful API 라우팅 및 미들웨어 처리 |
| **Database** | `MongoDB` + `Mongoose` | NoSQL 데이터베이스 및 객체 모델링(ODM) |
| **Rate Limit** | `@upstash/redis` + `@upstash/ratelimit` | 서버리스 Redis 기반 분산 요청 한도 제어 |
| **Utils** | `cors`, `dotenv` | CORS 정책 허용 및 환경 변수 관리 |

### Web Frontend

| 구분 | 기술 / 라이브러리 | 용도 및 특징 |
| :--- | :--- | :--- |
| **Framework** | `React` (v19) + `Vite` (v8) | 초고속 빌드 및 모던 리액트 환경 |
| **Routing** | `React Router` (v8) | 클라이언트 사이드 SPA 페이지 라우팅 |
| **Styling** | `Tailwind CSS` (v4) + `daisyUI` (v5) | 유틸리티 퍼스트 CSS 및 시맨틱 UI 컴포넌트 |
| **Icons** | `Lucide React` | 가볍고 일관된 모던 벡터 아이콘 셋 |
| **Notification** | `React Hot Toast` | 직관적인 성공/실패 토스트 팝업 알림 |
| **HTTP Client** | `Fetch API` + Custom `ApiError` | 커스텀 에러 처리 및 429 감지 |

### Mobile Frontend (준비)

- **Framework**: `Expo` (React Native)
- **Routing**: `Expo Router`

---

## 📁 프로젝트 구조 (Folder Structure)

```
webMobile-thinkpad/
 ├── backend/                     # 백엔드 서버 소스 코드
 │    ├── src/
 │    │    ├── controllers/
 │    │    │    └── note.controller.js   # 노트 CRUD 비즈니스 로직
 │    │    ├── middleware/
 │    │    │    └── rateLimiter.js       # Upstash Redis 기반 Rate Limit 미들웨어
 │    │    ├── models/
 │    │    │    └── Note.model.js        # Mongoose 노트 스키마 정의
 │    │    ├── routes/
 │    │    │    └── note.route.js        # /api/notes 라우트 정의
 │    │    ├── utils/
 │    │    │    ├── connectDB.js         # MongoDB 연결 유틸리티
 │    │    │    └── upstash.js           # Upstash Redis & Ratelimit 클라이언트 설정
 │    │    └── server.js                 # Express 엔트리 포인트
 │    ├── .env                           # 백엔드 환경 변수 (PORT, MONGO_URI, UPSTASH)
 │    └── package.json                   # 백엔드 의존성 관리
 │
 ├── frontend/                    # 프론트엔드 웹 소스 코드
 │    ├── public/                 # 정적 리소스 (favicon, icons)
 │    ├── src/
 │    │    ├── components/
 │    │    │    ├── DeleteModal.jsx      # 노트 삭제 확인 모달
 │    │    │    ├── EditModal.jsx        # 노트 인라인 빠른 수정 모달
 │    │    │    ├── Header.jsx           # 네비게이션 헤더 및 테마 셀렉터
 │    │    │    ├── RateLimitedUI.jsx    # 429 요청 한도 초과 시 전용 UI
 │    │    │    ├── ThemeSelector.jsx    # Light, Dark, Forest 테마 선택 드롭다운
 │    │    │    └── ThinkCard.jsx        # 메인 카드 뷰 컴포넌트
 │    │    ├── hooks/
 │    │    │    └── useDebounce.js       # 검색어 디바운스 커스텀 훅
 │    │    ├── lib/
 │    │    │    ├── api.js               # 백엔드 API 통신 및 ApiError 핸들링
 │    │    │    └── colors.js            # 카드별 고유 그라데이션 색상 매핑
 │    │    ├── pages/
 │    │    │    ├── CreatePage.jsx       # 새 Think 작성 페이지 (/create)
 │    │    │    ├── HomePage.jsx         # Think 목록 및 검색 페이지 (/)
 │    │    │    ├── NoteDetailPage.jsx   # Think 상세 보기 및 수정/삭제 (/note/:id)
 │    │    │    └── NotFoundPage.jsx     # 404 페이지
 │    │    ├── App.jsx                  # 라우트 및 기본 레이아웃 구성
 │    │    ├── index.css                # Tailwind CSS v4 & daisyUI 플러그인 등록
 │    │    └── main.jsx                 # React DOM 렌더링 엔트리
 │    ├── index.html                    # HTML 템플릿 & 테마 초기화 스크립트
 │    ├── .env                          # 프론트엔드 환경 변수 (VITE_API_URL)
 │    └── package.json                  # 프론트엔드 의존성 관리
 │
 ├── mobile/                      # 모바일 앱 (Expo) 프로젝트 폴더
 └── README.md                    # 프로젝트 종합 설명 문서 (본 파일)
```

---

## 🔌 API 명세서 (API Endpoints)

기본 URL: `http://localhost:3000/api/notes` (또는 포트 설정에 따름)

| 메서드 | 엔드포인트 | 설명 | 요청 본문 (Body) | 성공 응답 |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/notes` | 전체 Think 목록 조회 | 없음 | `200 OK` (Note 배열) |
| **GET** | `/api/notes/:id` | 특정 Think 상세 조회 | 없음 | `200 OK` (Note 객체) |
| **POST** | `/api/notes` | 새 Think 작성 | `{ "title": "...", "content": "..." }` | `201 Created` (생성된 Note) |
| **PUT** | `/api/notes/:id` | Think 내용 수정 | `{ "title": "...", "content": "..." }` | `200 OK` (수정된 Note) |
| **DELETE** | `/api/notes/:id` | Think 삭제 | 없음 | `200 OK` (`{ message: "..." }`) |

### 상태 코드 안내
- `200 OK` / `201 Created`: 요청 성공
- `400 Bad Request`: 필수 값 누락 (`title`, `content`)
- `404 Not Found`: 존재하지 않는 Note ID 조회/수정/삭제 시
- `429 Too Many Requests`: 요청 한도(분당 100회) 초과 시
- `500 Internal Server Error`: 서버 내부 에러

---

## 🚀 시작하기 (Getting Started)

### 1) 사전 요구사항
- **Node.js** (v18 이상 권장)
- **MongoDB** 데이터베이스 URI (MongoDB Atlas 또는 로컬)
- **Upstash Redis** REST URL 및 Token (Upstash 콘솔에서 생성)

---

### 2) 백엔드 (Backend) 설정 및 실행

1. **디렉토리 이동:**
   ```bash
   cd backend
   ```

2. **패키지 설치:**
   ```bash
   npm install
   ```

3. **환경 변수 파일 (`backend/.env`) 설정:**
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/thinkpad?retryWrites=true&w=majority
   UPSTASH_REDIS_REST_URL=https://your-upstash-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
   ```

4. **백엔드 서버 실행:**
   ```bash
   # 개발 모드 (자동 재시작)
   npm run dev

   # 프로덕션 실행
   npm start
   ```
   > 정상 실행 시 콘솔에 `Server is running on port 3000` 및 MongoDB 연결 성공 로그가 출력됩니다.

---

### 3) 프론트엔드 (Frontend) 설정 및 실행

1. **디렉토리 이동 (새 터미널 창):**
   ```bash
   cd frontend
   ```

2. **패키지 설치:**
   ```bash
   npm install
   ```

3. **환경 변수 파일 (`frontend/.env`) 설정:**
   ```env
   VITE_API_URL=http://localhost:3000/api/notes
   ```

4. **개발 서버 실행:**
   ```bash
   npm run dev
   ```
   > 브라우저에서 `http://localhost:5173`으로 접속합니다.

5. **프로덕션 빌드 및 린트 검사:**
   ```bash
   # 린트 검사
   npm run lint

   # 프로덕션 번들 빌드
   npm run build
   ```

---

### 4) Render 풀스택(Fullstack) 배포 설정

Render Web Service를 통해 프론트엔드와 백엔드를 단일 서비스로 배포할 수 있습니다.

1. **Render 대시보드에서 `New Web Service` 생성**
   - GitHub 저장소 연결
2. **배포 설정 입력:**
   - **Environment**: `Node`
   - **Build Command**: `npm run build` (루트 `package.json`에서 백엔드/프론트엔드 의존성 설치 및 프론트 빌드 자동 수행)
   - **Start Command**: `npm start` (또는 `node backend/src/server.js`)
3. **환경 변수(Environment Variables) 등록:**
   - `NODE_ENV` = `production`
   - `MONGO_URI` = `mongodb+srv://...`
   - `UPSTASH_REDIS_REST_URL` = `https://...`
   - `UPSTASH_REDIS_REST_TOKEN` = `...`
4. **배포 완료 및 14분 자동 헬스체크 (Keep-Alive):**
   - 백엔드 Express가 정적 빌드 파일(`frontend/dist`)과 API(`/api/notes`)를 동시에 완벽하게 서빙합니다.
   - Render Free Tier의 15분 비활성 슬립(Cold Start)을 방지하기 위해, 서버가 시작되면 14분마다 `/api/health`로 자동 핑(Self-Ping)을 보내 무중단 가동 상태를 유지합니다.

---

## 💡 주요 작업 내용 및 핵심 구현 절차

### 1. daisyUI 5 멀티 테마 시스템 (`Light`, `Dark`, `Forest`)

#### 1) Tailwind CSS v4 기반 테마 플러그인 등록
[`frontend/src/index.css`](frontend/src/index.css)에 daisyUI v5 플러그인과 사용할 테마를 선언합니다.
```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, dark, forest;
}
```

#### 2) 테마 전환 컴포넌트 ([`ThemeSelector.jsx`](frontend/src/components/ThemeSelector.jsx))
- `useState` 및 `useEffect`를 통해 선택된 테마를 `document.documentElement.setAttribute('data-theme', theme)`로 즉시 반영.
- 브라우저를 닫아도 설정이 유지되도록 `localStorage.setItem('thinkpad_theme', theme)`에 저장.

#### 3) 깜빡임(FOUC) 방지 ([`frontend/index.html`](frontend/index.html))
React 렌더링 전 `<head>` 내부 즉시 실행 함수(IIFE)를 통해 저장된 테마를 우선 적용하여 화면 전환 깜빡임을 완벽히 차단했습니다.
```html
<script>
  (function () {
    const savedTheme = localStorage.getItem("thinkpad_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  })();
</script>
```

---

### 2. Upstash Redis 기반 분산 Rate Limiting & 전용 UI 연동

#### 1) 백엔드 Rate Limit 미들웨어 ([`backend/src/middleware/rateLimiter.js`](backend/src/middleware/rateLimiter.js))
- Upstash Redis의 **Sliding Window 알고리즘**을 사용하여 클라이언트 IP 기준 **분당 100회** 요청 제한.
- 응답 헤더(`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`) 추가.
- 초과 시 HTTP 429 상태 코드와 안내 JSON 반환.

#### 2) 프론트엔드 API 에러 모델링 ([`frontend/src/lib/api.js`](frontend/src/lib/api.js))
- 커스텀 `ApiError` 클래스를 도입하여 `status === 429` 및 `isRateLimited` 여부를 전역적으로 일관되게 감지.

#### 3) 전용 Rate Limit 화면 ([`RateLimitedUI.jsx`](frontend/src/components/RateLimitedUI.jsx))
- **경고 디자인**: 429 뱃지, 경고 애니메이션 아이콘, 시맨틱 컬러 적용.
- **카운트다운 타이머**: 남은 재시도 권장 시간을 실시간 프로그레스 바와 함께 안내.
- **스마트 네비게이션**: 
  - `다시 시도하기`: 실패한 API 요청을 즉시 재시도.
  - `홈으로 이동`: 이미 홈 화면인 경우 데이터를 재조회하고, 상세/작성 페이지인 경우 안전하게 홈 라우트로 이동.

---

### 3. Think(메모) CRUD 및 스마트 인터랙션

1. **홈 화면 (`HomePage.jsx`)**
   - Think 카드 목록 렌더링 및 디바운스 실시간 검색.
   - 로딩 스켈레톤 애니메이션 및 빈 데이터 안내 화면.
   - 퀵 수정 모달(`EditModal`) 및 삭제 확인 모달(`DeleteModal`) 탑재.
2. **작성 화면 (`CreatePage.jsx`)**
   - 제목과 내용 입력 및 실시간 유효성 검사, 작성 완료 후 즉시 홈으로 네비게이션.
3. **상세 화면 (`NoteDetailPage.jsx`)**
   - 카드 고유 색상 팔레트([`colors.js`](frontend/src/lib/colors.js)) 기반 배경 및 뱃지 표시.
   - 상세 보기 모드와 인라인 수정 모드 간 손쉬운 전환.

---

## ❓ 문제 해결 (Troubleshooting)

### Q1. 프론트엔드에서 `429 Too Many Requests`가 발생합니다.
- 백엔드 Upstash Redis 요청 한도(분당 100회)에 도달한 상태입니다.
- 화면에 표시되는 **재시도 대기 시간**이 지난 후 **[다시 시도하기]** 버튼을 클릭하면 정상 복구됩니다.

### Q2. 백엔드 실행 시 `Error connecting to MongoDB` 에러가 발생합니다.
- `backend/.env` 파일의 `MONGO_URI` 연결 문자열 및 IP 화이트리스트 설정을 확인하세요.

### Q3. 테마를 변경했는데 새로고침하면 원래대로 돌아갑니다.
- 브라우저의 로컬 스토리지(`localStorage`) 쓰기 권한이 비활성화되어 있는지 확인하세요.

---

**Happy Coding with ThinkPad! 🎉**
