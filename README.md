# 💡 ThinkPad - 크로스 플랫폼(Web & Mobile) 풀스택 메모 & 아이디어 기록 공간

> **ThinkPad**는 떠오르는 생각과 아이디어를 언제 어디서나 빠르고 아름답게 기록·관리할 수 있는 모던 풀스택 메모 플랫폼입니다.  
> **웹(React 19 + Vite + Tailwind CSS v4 + daisyUI 5)**과 **모바일 앱(Expo SDK 57 + React Native + NativeWind v4 + Expo Router)**, 그리고 **백엔드(Node.js + Express 5 + MongoDB + Upstash Redis)**가 유기적으로 연동되어 완벽한 크로스 플랫폼 경험을 제공합니다.

---

## 📑 목차 (Table of Contents)

1. [✨ 주요 서비스 및 핵심 기능](#-주요-서비스-및-핵심-기능)
2. [🛠️ 기술 스택 (Tech Stack)](#️-기술-스택-tech-stack)
3. [📁 프로젝트 폴더 구조 (Folder Structure)](#-프로젝트-폴더-구조-folder-structure)
4. [🔌 백엔드 API 명세서 (API Endpoints)](#-백엔드-api-명세서-api-endpoints)
5. [🚀 시작하기 (Getting Started)](#-시작하기-getting-started)
   - [1) 사전 요구사항](#1-사전-요구사항)
   - [2) 백엔드 (Backend) 설정 및 실행](#2-백엔드-backend-설정-및-실행)
   - [3) 웹 프론트엔드 (Frontend) 설정 및 실행](#3-웹-프론트엔드-frontend-설정-및-실행)
   - [4) 모바일 앱 (Mobile) 설정 및 실행](#4-모바일-앱-mobile-설정-및-실행)
   - [5) Render 클라우드 배포 및 무중단 가동](#5-render-클라우드-배포-및-무중단-가동)
6. [💡 주요 작업 내용 및 핵심 구현 절차](#-주요-작업-내용-및-핵심-구현-절차)
   - [1. 모바일(Expo) 앱 아키텍처 및 핵심 기능](#1-모바일expo-앱-아키텍처-및-핵심-기능)
   - [2. daisyUI 5 멀티 테마 시스템 (Light, Dark, Forest)](#2-daisyui-5-멀티-테마-시스템-light-dark-forest)
   - [3. Upstash Redis 기반 분산 Rate Limiting & 전용 UI 연동](#3-upstash-redis-기반-분산-rate-limiting--전용-ui-연동)
   - [4. Think CRUD 및 크로스 플랫폼 UI/UX 인터랙션](#4-think-crud-및-크로스-플랫폼-uiux-인터랙션)
7. [❓ 문제 해결 (Troubleshooting)](#-문제-해결-troubleshooting)

---

## ✨ 주요 서비스 및 핵심 기능

### 📝 1. Think(생각/메모) 생성·조회·수정·삭제 (Full CRUD)
- **실시간 작성 및 검증**: 제목과 내용을 입력하여 새로운 Think 카드를 즉시 생성.
- **카드형 목록 & 디바운스 검색**: 350ms 디바운스가 적용된 실시간 검색 기능 (2글자 이상 입력 시 필터링).
- **상세 보기 및 인라인/모달 수정**: 
  - 상세 페이지에서 즉시 내용을 수정하거나, 홈 화면에서 빠른 모달(Edit Modal)을 띄워 수정 가능.
- **안전한 삭제 확인**: 실수로 인한 삭제를 방지하기 위해 네이티브 및 커스텀 확인 모달(Delete Modal) 제공.

### 🎨 2. 감각적인 카드 컬러 팔레트 시스템
- 각 Think 카드의 고유 `_id`를 기반으로 해시 알고리즘을 적용하여 6가지의 조화로운 테마 컬러(Amber, Emerald, Indigo, Rose, Purple, Cyan)를 자동 매핑.
- 상단 포인트 바, 배지, 테두리, 악센트 컬러가 유기적으로 적용되어 시각적 만족감 제공.

### 🌓 3. 웹 멀티 테마 지원 (daisyUI 5)
- **`Light` (밝은 테마)**, **`Dark` (어두운 테마)**, **`Forest` (자연 숲 테마)** 3종 프리셋 전환.
- `localStorage` 저장 및 새로고침 시 화면 깜빡임(FOUC) 완벽 방지.

### 🛡️ 4. Upstash Redis 기반 분산 Rate Limiting & 전용 429 UI
- 백엔드 분당 100회 요청 제한(Sliding Window 알고리즘)으로 서버 과부하 방지.
- HTTP 429 발생 시 웹과 모바일 모두 **전용 에러 화면(`RateLimitedUI`)**으로 자동 전환.
- 실시간 재시도 대기 시간 카운트다운 타이머, 프로그레스 바, 원클릭 재시도 버튼 탑재.

### 📱 5. 모바일 최적화 UX (Expo Router + NativeWind)
- **화면 복귀 시 자동 데이터 갱신 (`useFocusEffect`)**: 상세/수정 화면에서 홈 화면으로 복귀 시 항상 최신 데이터 동기화.
- **모바일 제스처 & 네이티브 컨트롤**: 당겨서 새로고침(`RefreshControl`), 플로팅 작성 버튼(FAB), 키보드 회피 뷰(`KeyboardAvoidingView`), 터치 슬롭(HitSlop) 최적화.

---

## 🛠️ 기술 스택 (Tech Stack)

### Backend

| 영역 | 기술 / 라이브러리 | 버전 | 용도 및 특징 |
| :--- | :--- | :--- | :--- |
| **Runtime** | `Node.js` | v18+ | ES Modules 기반 서버 런타임 |
| **Framework** | `Express.js` | v5.1 | RESTful API 라우팅 및 미들웨어 파이프라인 |
| **Database** | `MongoDB` + `Mongoose` | v9.2 | NoSQL 데이터베이스 및 객체 스키마 모델링 |
| **Rate Limit** | `@upstash/redis` + `@upstash/ratelimit` | v1.35 / v2.0 | 서버리스 Redis 기반 글로벌 분산 요청 제한 |
| **Utility** | `cors`, `dotenv`, `node-cron` | - | CORS 설정, 환경 변수 주입, Render 헬스체크 핑 |

### Web Frontend

| 영역 | 기술 / 라이브러리 | 버전 | 용도 및 특징 |
| :--- | :--- | :--- | :--- |
| **Framework** | `React` + `Vite` | v19 / v8 | SPA 클라이언트 프레임워크 및 고속 번들러 |
| **Routing** | `React Router` | v8.3 | 브라우저 히스토리 기반 페이지 라우팅 |
| **Styling** | `Tailwind CSS` + `daisyUI` | v4.2 / v5.5 | 유틸리티 퍼스트 CSS 및 멀티 테마 컴포넌트 |
| **Icons** | `Lucide React` | v1.16 | 모던 벡터 아이콘 셋 |
| **Notification**| `React Hot Toast` | v2.6 | 실시간 작업 피드백 알림 |

### Mobile Frontend (Expo)

| 영역 | 기술 / 라이브러리 | 버전 | 용도 및 특징 |
| :--- | :--- | :--- | :--- |
| **Framework** | `Expo` (React Native) | SDK 57 | 모바일 크로스 플랫폼 네이티브 런타임 |
| **Routing** | `Expo Router` | v57 | 파일 기반 라우팅 시스템 (`src/app/`) |
| **Styling** | `NativeWind` + `Tailwind CSS` | v4.2 / v3.4 | React Native용 Tailwind CSS 스타일링 |
| **Storage** | `@react-native-async-storage` | v3.1 | 로컬 영구 스토리지 |
| **Icons** | `lucide-react-native` | v1.39 | 네이티브 벡터 아이콘 셋 |
| **Safe Area** | `react-native-safe-area-context` | v5.7 | 노치 및 하단 바 안전 영역 대응 |

---

## 📁 프로젝트 폴더 구조 (Folder Structure)

```
webMobile-thinkpad/
 ├── backend/                     # 백엔드 서버 소스 코드
 │    ├── src/
 │    │    ├── controllers/
 │    │    │    └── note.controller.js   # Note CRUD 비즈니스 로직
 │    │    ├── middleware/
 │    │    │    └── rateLimiter.js       # Upstash Redis 기반 Rate Limit 미들웨어
 │    │    ├── models/
 │    │    │    └── Note.model.js        # Mongoose Note 스키마
 │    │    ├── routes/
 │    │    │    └── note.route.js        # /api/notes 라우팅 정의
 │    │    ├── utils/
 │    │    │    ├── connectDB.js         # MongoDB 연결 유틸리티
 │    │    │    ├── cron.js              # Render 슬립 방지 14분 헬스체크 서비스
 │    │    │    └── upstash.js           # Upstash Redis & Ratelimit 인스턴스
 │    │    └── server.js                 # Express 엔트리 포인트
 │    ├── .env                           # 백엔드 환경 변수 (PORT, MONGO_URI, UPSTASH)
 │    └── package.json                  # 백엔드 패키지 설정
 │
 ├── frontend/                    # 웹 프론트엔드 (React + Vite)
 │    ├── public/                 # 웹 정적 리소스
 │    ├── src/
 │    │    ├── components/
 │    │    │    ├── DeleteModal.jsx      # 웹 삭제 확인 모달
 │    │    │    ├── EditModal.jsx        # 웹 빠른 수정 모달
 │    │    │    ├── Header.jsx           # 상단 네비게이션 & 테마 선택기
 │    │    │    ├── RateLimitedUI.jsx    # 429 에러 전용 UI 컴포넌트
 │    │    │    ├── ThemeSelector.jsx    # Light / Dark / Forest 테마 드롭다운
 │    │    │    └── ThinkCard.jsx        # Think 카드 뷰 컴포넌트
 │    │    ├── hooks/
 │    │    │    └── useDebounce.js       # 검색어 350ms 디바운스 훅
 │    │    ├── lib/
 │    │    │    ├── api.js               # Web Fetch API 통신 및 ApiError 처리
 │    │    │    └── colors.js            # Think 카드 테마 색상 팔레트
 │    │    ├── pages/
 │    │    │    ├── CreatePage.jsx       # 새 Think 작성 페이지 (/create)
 │    │    │    ├── HomePage.jsx         # 메인 목록 및 검색 페이지 (/)
 │    │    │    ├── NoteDetailPage.jsx   # Think 상세 페이지 (/note/:id)
 │    │    │    └── NotFoundPage.jsx     # 404 페이지
 │    │    ├── App.jsx                  # React Router 라우트 정의
 │    │    ├── index.css                # Tailwind CSS v4 & daisyUI 설정
 │    │    └── main.jsx                 # React DOM 엔트리
 │    ├── index.html                    # FOUC 방지 테마 스크립트 내장 HTML
 │    ├── .env                          # 웹 환경 변수 (VITE_API_URL)
 │    └── package.json                  # 웹 프론트엔드 패키지 설정
 │
 ├── mobile/                      # 모바일 앱 (Expo React Native)
 │    ├── assets/                 # 앱 아이콘, 스플래시 이미지
 │    ├── src/
 │    │    ├── app/                     # Expo Router 파일 기반 라우트
 │    │    │    ├── _layout.jsx         # 루트 레이아웃 (SafeArea, StatusBar, global.css)
 │    │    │    ├── index.jsx           # 모바일 메인 홈 화면 (목록, 검색, 새로고침, FAB)
 │    │    │    ├── create.jsx          # 새 Think 작성 화면
 │    │    │    └── note/
 │    │    │         └── [id].jsx       # Think 상세 화면 (인라인 수정, 삭제)
 │    │    ├── components/
 │    │    │    ├── DeleteModal.jsx      # 네이티브 삭제 확인 대화상자
 │    │    │    ├── EditModal.jsx        # 네이티브 바텀시트 빠른 수정 모달
 │    │    │    ├── Header.jsx           # 모바일 상단 브랜딩 헤더
 │    │    │    ├── RateLimitedUI.jsx    # 모바일 429 Rate Limit 화면
 │    │    │    └── ThinkCard.jsx        # 모바일 최적화 Think 카드 컴포넌트
 │    │    ├── hooks/
 │    │    │    └── useDebounce.js       # 모바일 검색 디바운스 훅
 │    │    └── lib/
 │    │         ├── api.js               # 모바일 API 통신 (EXPO_PUBLIC_API_URL 연동)
 │    │         └── colors.js            # 모바일 카드 컬러 팔레트 상수
 │    ├── .env                          # 모바일 환경 변수 (EXPO_PUBLIC_API_URL)
 │    ├── babel.config.js               # NativeWind Babel 플러그인 설정
 │    ├── metro.config.js               # NativeWind Metro 번들러 설정
 │    ├── tailwind.config.js            # 모바일 Tailwind 테마 프리셋
 │    ├── global.css                    # 모바일 전역 Tailwind CSS
 │    └── package.json                  # 모바일 앱 패키지 설정
 │
 ├── package.json                 # 루트 모노레포 통합 실행 스크립트
 └── README.md                    # 프로젝트 종합 매뉴얼 (본 문서)
```

---

## 🔌 백엔드 API 명세서 (API Endpoints)

- **로컬 기본 URL**: `http://localhost:3000/api/notes`
- **배포 서버 URL**: `https://webmobile-thinkpad.onrender.com/api/notes`

| 메서드 | 엔드포인트 | 설명 | 요청 본문 (JSON Body) | 성공 응답 |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/notes` | 전체 Think 목록 조회 | 없음 | `200 OK` (Note 배열) |
| **GET** | `/api/notes/:id` | 특정 Think 상세 조회 | 없음 | `200 OK` (Note 객체) |
| **POST** | `/api/notes` | 새 Think 작성 | `{ "title": "...", "content": "..." }` | `201 Created` (생성된 Note) |
| **PUT** | `/api/notes/:id` | Think 내용 수정 | `{ "title": "...", "content": "..." }` | `200 OK` (수정된 Note) |
| **DELETE** | `/api/notes/:id` | Think 영구 삭제 | 없음 | `200 OK` (`{ message: "..." }`) |
| **GET** | `/api/health` | 서버 헬스체크 핑 | 없음 | `200 OK` (`{ status: "ok" }`) |

### HTTP 상태 코드 정의
- `200 OK` / `201 Created`: 성공
- `400 Bad Request`: 필수 항목 누락 (`title`, `content`)
- `404 Not Found`: 존재하지 않는 ID 요청
- `429 Too Many Requests`: 요청 한도(분당 100회) 초과
- `500 Internal Server Error`: 데이터베이스 또는 서버 내부 오류

---

## 🚀 시작하기 (Getting Started)

### 1) 사전 요구사항
- **Node.js** (v18 이상)
- **MongoDB Atlas** 또는 로컬 MongoDB 계정
- **Upstash Redis** REST URL 및 Token (Upstash 콘솔에서 생성)
- **Expo Go** 앱 (스마트폰 테스트 시)

---

### 2) 백엔드 (Backend) 설정 및 실행

```bash
# 1. 백엔드 폴더 이동
cd backend

# 2. 패키지 설치
npm install

# 3. 환경 변수 파일 (backend/.env) 생성 및 작성
cat << EOF > .env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/thinkpad?retryWrites=true&w=majority
UPSTASH_REDIS_REST_URL=https://your-upstash-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
EOF

# 4. 개발 서버 구동
npm run dev
```

---

### 3) 웹 프론트엔드 (Frontend) 설정 및 실행

```bash
# 1. 프론트엔드 폴더 이동
cd frontend

# 2. 패키지 설치
npm install

# 3. 환경 변수 (frontend/.env) 확인
# 로컬 개발 시: VITE_API_URL=http://localhost:3000/api/notes
# 원격 서버 연결 시: VITE_API_URL=https://webmobile-thinkpad.onrender.com/api/notes

# 4. Vite 개발 서버 실행
npm run dev
# 브라우저에서 http://localhost:5173 접속
```

---

### 4) 모바일 앱 (Mobile) 설정 및 실행

```bash
# 1. 모바일 폴더 이동
cd mobile

# 2. 패키지 설치
npm install

# 3. 환경 변수 (mobile/.env) 확인
# EXPO_PUBLIC_API_URL=https://webmobile-thinkpad.onrender.com/api/notes

# 4. Expo 개발 서버 실행
npx expo start
```
- 터미널에 나타나는 QR 코드를 스마트폰의 **Expo Go** 앱으로 스캔하거나, `a` (Android 에뮬레이터), `i` (iOS 시뮬레이터), `w` (웹 브라우저) 키를 눌러 실행합니다.

---

### 5) Render 클라우드 배포 및 무중단 가동

- **Build Command**: `npm run build` (루트 `package.json`에서 백엔드 및 프론트엔드 의존성을 자동 설치하고 프론트 빌드 생성)
- **Start Command**: `npm start`
- **Render 환경 변수**: `NODE_ENV=production`, `MONGO_URI`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- **14분 무중단 가동(Keep-Alive)**: [`backend/src/utils/cron.js`](backend/src/utils/cron.js)가 14분마다 `/api/health`를 자체 호출하여 Render Free Tier 슬립을 방지합니다.

---

## 💡 주요 작업 내용 및 핵심 구현 절차

### 1. 모바일(Expo) 앱 아키텍처 및 핵심 기능

#### 1) NativeWind v4 설정
- [`mobile/metro.config.js`](mobile/metro.config.js)와 [`mobile/babel.config.js`](mobile/babel.config.js)에 NativeWind를 통합하여 React Native 컴포넌트에서 Tailwind CSS 클래스명을 그대로 사용.
- [`mobile/global.css`](mobile/global.css)를 통해 전역 스타일을 주입하고, VS Code CSS 린터 경고를 완벽히 해결.

#### 2) 화면 복귀 시 자동 데이터 동기화 (`useFocusEffect`)
- 모바일 환경에서는 상세 페이지([`app/note/[id].jsx`](mobile/src/app/note/[id].jsx))나 수정 모달에서 수정을 완료하고 홈 화면([`app/index.jsx`](mobile/src/app/index.jsx))으로 돌아올 때 컴포넌트가 언마운트되지 않으므로, Expo Router의 `useFocusEffect`를 적용하여 포커스 복귀 시 항상 최신 Think 목록을 불러오도록 구현했습니다.

```javascript
import { useFocusEffect } from "expo-router";

useFocusEffect(
  useCallback(() => {
    loadNotes(false);
  }, [loadNotes])
);
```

#### 3) 모바일 인터랙션 최적화
- **당겨서 새로고침**: `FlatList`에 `RefreshControl`을 연동하여 손가락으로 아래로 당기면 즉시 목록 새로고침.
- **플로팅 액션 버튼(FAB)**: 한 손 조작이 용이하도록 우측 하단에 고정된 원형 플러스 버튼 제공.
- **키보드 회피 뷰**: `KeyboardAvoidingView`를 통해 작성/수정 중 키보드가 입력창을 가리지 않도록 보정.

---

### 2. daisyUI 5 멀티 테마 시스템 (`Light`, `Dark`, `Forest`)

1. **테마 선언**: [`frontend/src/index.css`](frontend/src/index.css)에 `@import "tailwindcss";` 및 `@plugin "daisyui"`로 테마 등록.
2. **테마 선택기**: [`frontend/src/components/ThemeSelector.jsx`](frontend/src/components/ThemeSelector.jsx)에서 `document.documentElement.setAttribute("data-theme", theme)`로 즉시 변경 및 `localStorage` 저장.
3. **FOUC 방지**: [`frontend/index.html`](frontend/index.html) `<head>` 내부에 초기화 스크립트를 삽입하여 새로고침 시 깜빡임 없이 이전 테마를 즉시 렌더링.

---

### 3. Upstash Redis 기반 분산 Rate Limiting & 전용 UI 연동

1. **백엔드 미들웨어 ([`backend/src/middleware/rateLimiter.js`](backend/src/middleware/rateLimiter.js))**:
   - 클라이언트 IP 기준 분당 100회 요청 제한(Sliding Window).
   - 초과 시 HTTP 429 반환.
2. **클라이언트 에러 핸들링 ([`lib/api.js`](mobile/src/lib/api.js))**:
   - `status === 429` 발생 시 `isRateLimited: true` 플래그가 포함된 `ApiError` 인스턴스 전파.
3. **전용 429 화면 ([`RateLimitedUI.jsx`](mobile/src/components/RateLimitedUI.jsx))**:
   - 30초 카운트다운 타이머와 애니메이션 프로그레스 바.
   - 대기 시간 종료 후 [다시 시도하기] 버튼을 통해 원래 요청 재수행.

---

### 4. Think CRUD 및 크로스 플랫폼 UI/UX 인터랙션

- **일관된 디자인 언어**: 웹과 모바일 모두 동일한 6색 카드 컬러 팔레트, 아이콘 스타일, 여백과 폰트 크기 비율을 유지하여 플랫폼 간 이질감 없는 완성도 높은 사용자 경험을 제공합니다.
- **에러 복구성**: 네트워크 단절, 데이터 미입력, 유효성 검사 실패 등 모든 비정상 상황에 대해 적절한 알림 및 피드백을 제공합니다.

---

## ❓ 문제 해결 (Troubleshooting)

### Q1. 모바일 앱에서 데이터를 불러오지 못합니다.
- `mobile/.env` 파일의 `EXPO_PUBLIC_API_URL`이 올바르게 설정되어 있는지 확인하세요.
- 기본값으로 설정된 배포 서버 URL(`https://webmobile-thinkpad.onrender.com/api/notes`)이 정상 작동 중인지 웹 브라우저에서 접속하여 확인하세요.

### Q2. 429 Too Many Requests가 발생합니다.
- Upstash Redis Rate Limiting(분당 100회)에 도달한 상태입니다.
- 화면의 카운트다운(약 30초)이 끝난 후 **[다시 시도하기]**를 누르면 정상 복구됩니다.

### Q3. 모바일에서 제목 수정 후 목록으로 돌아갔을 때 반영이 안 되나요?
- 최신 코드에는 `useFocusEffect`가 적용되어 있어 화면 이동 후 복귀 시 자동으로 최신 데이터를 다시 불러옵니다.

---

**Happy Coding with ThinkPad! 🎉**
