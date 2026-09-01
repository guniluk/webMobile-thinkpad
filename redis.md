# Upstash Redis & Rate Limit 완벽 가이드

이 문서는 초보자도 쉽게 따라할 수 있도록 **Upstash 웹 콘솔 설정**부터 **Redis Key-Value DB 활용법**, 그리고 **API 요청 제한(Rate Limit) 적용법**을 단계별로 정리한 가이드입니다.

---

## 📌 목차
1. [Upstash 웹사이트에서 데이터베이스 생성하기](#1-upstash-웹사이트에서-데이터베이스-생성하기)
2. [프로젝트 패키지 설치 및 환경 변수 설정](#2-프로젝트-패키지-설치-및-환경-변수-설정)
3. [PART 1: Redis DB (Key-Value) 활용법](#3-part-1-redis-db-key-value-활용법)
   - [3-1. Redis 클라이언트 연결](#3-1-redis-클라이언트-연결)
   - [3-2. 기본 CRUD 명령어 (SET, GET, DEL 등)](#3-2-기본-crud-명령어-set-get-del-등)
   - [3-3. 실전 캐싱(Cache) 구현 예시](#3-3-실전-캐싱cache-구현-예시)
4. [PART 2: Rate Limit (요청 횟수 제한) 적용법](#4-part-2-rate-limit-요청-횟수-제한-적용법)
   - [4-1. Rate Limit 개념 및 알고리즘](#4-1-rate-limit-개념-및-알고리즘)
   - [4-2. Rate Limit 인스턴스 생성](#4-2-rate-limit-인스턴스-생성)
   - [4-3. Express 미들웨어로 Rate Limit 구현](#4-3-express-미들웨어로-rate-limit-구현)
   - [4-4. 특정 라우트에 적용하기](#4-4-특정-라우트에-적용하기)
5. [자주 묻는 질문 & 주의사항](#5-자주-묻는-질문--주의사항)

---

## 1. Upstash 웹사이트에서 데이터베이스 생성하기

Upstash는 서버리스(Serverless) 환경에 최적화된 HTTP 기반의 Redis 호스팅 서비스입니다.

### 1단계: 회원가입 및 로그인
1. [Upstash 공식 홈페이지 (https://upstash.com)](https://upstash.com)에 접속합니다.
2. 우측 상단의 **`Console`** 또는 **`Sign Up`**을 클릭하여 GitHub 또는 Google 계정으로 간편 가입/로그인합니다.

### 2단계: Redis 데이터베이스 생성
1. 대시보드 상단 메뉴에서 **`Redis`** 탭을 클릭합니다.
2. **`Create Database`** 버튼을 클릭합니다.
3. 데이터베이스 설정 입력:
   - **Name**: 프로젝트에 맞는 이름 입력 (예: `my-app-redis`)
   - **Type**: `Regional` 선택 (단일 리전, 무료 플랜 지원)
   - **Region**: 서비스 대상과 가장 가까운 지역 선택 (예: `ap-northeast-1 / Tokyo` 또는 `ap-southeast-1 / Singapore`)
   - **Primary / Read Region**: 기본값 유지
4. 하단의 **`Create`** 버튼을 누릅니다.

### 3단계: 환경 변수 (REST URL, Token) 복사
1. 생성된 데이터베이스 상세 페이지로 이동합니다.
2. 화면을 아래로 스크롤하여 **`REST API`** 섹션을 찾습니다.
3. `.env` 탭을 선택하면 아래와 같은 형식의 환경 변수가 나타납니다:
   ```env
   UPSTASH_REDIS_REST_URL="https://xxxx-xxxxx.upstash.io"
   UPSTASH_REDIS_REST_TOKEN="AYxxxxxx..."
   ```
4. **Copy** 버튼을 눌러 이 두 값을 복사해 둡니다.

---

## 2. 프로젝트 패키지 설치 및 환경 변수 설정

### 1단계: npm 패키지 설치
백엔드 폴더(`backend`) 또는 프로젝트 루트에서 터미널을 열고 설치합니다:

```bash
npm install @upstash/redis @upstash/ratelimit dotenv
```

- `@upstash/redis`: Upstash Redis와 통신하기 위한 HTTP 기반 SDK
- `@upstash/ratelimit`: Redis 기반의 요청 횟수 제한(Rate Limiting) SDK
- `dotenv`: `.env` 파일의 환경변수를 읽어오기 위한 라이브러리

### 2단계: `.env` 파일에 환경 변수 추가
백엔드의 `.env` 파일에 복사해 둔 Upstash 연결 정보를 붙여넣습니다:

```env
# Upstash Redis 설정
UPSTASH_REDIS_REST_URL="https://your-database-name.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_secret_token_here"
```

---

## 3. PART 1: Redis DB (Key-Value) 활용법

Redis는 메모리 기반의 초고속 **Key-Value(키-값)** 저장소입니다. 세션 관리, 임시 데이터 저장, DB 쿼리 결과 캐싱 등에 주로 쓰입니다.

### 3-1. Redis 클라이언트 연결

공통으로 사용할 Redis 클라이언트 모듈을 생성합니다.

📁 **`src/utils/redis.js`** (또는 `src/lib/redis.js`)
```javascript
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

// Redis 인스턴스 생성
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
```

---

### 3-2. 기본 CRUD 명령어 (SET, GET, DEL 등)

`@upstash/redis`는 직관적인 비동기(Promise) 메서드를 지원합니다. 객체나 배열도 자동으로 JSON 직렬화/역직렬화가 됩니다.

```javascript
import { redis } from "../utils/redis.js";

// 1. 데이터 저장 (SET)
await redis.set("username", "홍길동");

// 2. 만료 시간(TTL)과 함께 저장 (초 단위: ex)
// 60초 뒤에 자동으로 삭제되는 키
await redis.set("auth_code:user123", "984214", { ex: 60 });

// 3. 객체나 배열 저장 (자동 JSON 변환)
await redis.set("user:profile:1", {
  name: "Kim",
  role: "admin",
  preferences: { theme: "dark" },
});

// 4. 데이터 조회 (GET)
const username = await redis.get("username");
console.log(username); // "홍길동"

const profile = await redis.get("user:profile:1");
console.log(profile.name); // "Kim" (자동 파싱됨)

// 5. 데이터 삭제 (DEL)
await redis.del("username");

// 6. 키 존재 여부 확인 (EXISTS) - 존재하면 1, 없으면 0 반환
const exists = await redis.exists("user:profile:1");

// 7. 숫자 1씩 증가/감소 (조회수, 카운터 등에 유용)
await redis.incr("post:views:100"); // 1 증가
await redis.decr("inventory:item:5"); // 1 감소

// 8. 기존 키에 만료 시간 부여 (EXPIRE)
await redis.expire("post:views:100", 3600); // 1시간(3600초) 후 만료
```

---

### 3-3. 실전 캐싱(Cache) 구현 예시

데이터베이스(MongoDB 등)의 반복적인 무거운 조회를 줄이기 위한 **Cache-Aside 패턴** 예시입니다:

```javascript
import { redis } from "../utils/redis.js";
import Post from "../models/Post.js";

// 게시글 목록 조회 컨트롤러 (캐싱 적용)
export const getPosts = async (req, res) => {
  const cacheKey = "posts:all";

  try {
    // 1. 먼저 Redis 캐시에서 데이터가 있는지 확인
    const cachedPosts = await redis.get(cacheKey);

    if (cachedPosts) {
      console.log("⚡ 캐시에서 데이터를 반환합니다.");
      return res.status(200).json({ success: true, source: "cache", data: cachedPosts });
    }

    // 2. 캐시에 없으면 실제 DB(MongoDB)에서 조회
    console.log("🐢 DB에서 직접 조회합니다.");
    const posts = await Post.find().sort({ createdAt: -1 });

    // 3. 조회한 데이터를 Redis 캐시에 5분(300초) 동안 저장
    await redis.set(cacheKey, posts, { ex: 300 });

    res.status(200).json({ success: true, source: "db", data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 새 게시글 작성 시 캐시 무효화(삭제)
export const createPost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);

    // 새 글이 작성되었으므로 기존 캐시 삭제 (최신 데이터 유지를 위함)
    await redis.del("posts:all");

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

## 4. PART 2: Rate Limit (요청 횟수 제한) 적용법

Rate Limit은 특정 IP나 사용자가 짧은 시간에 과도한 API 요청을 보내 서버를 마비시키거나(DDoS), 비밀번호 무차별 대입 공격(Brute Force)을 하는 것을 방지합니다.

### 4-1. Rate Limit 개념 및 알고리즘

`@upstash/ratelimit`은 다음과 같은 알고리즘을 지원합니다:

| 알고리즘 | 설명 | 추천 사용처 |
| :--- | :--- | :--- |
| **Sliding Window** (권장) | 롤링 타임 윈도우를 사용하여 경계 시간의 트래픽 급증을 부드럽게 완화 | 일반적인 API, 로그인/회원가입 등 |
| **Fixed Window** | 정해진 고정 시간(예: 0분~1분) 단위로 횟수 리셋 | 단순한 요청 제한 |
| **Token Bucket** | 토큰이 일정 주기로 채워지며, 순간적인 버스트(Burst) 트래픽 허용 | 결제, 파일 다운로드 등 |

---

### 4-2. Rate Limit 인스턴스 생성

📁 **`src/utils/ratelimit.js`**
```javascript
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit"; // ⚠️ 주의: 대문자 R, 소문자 l
import dotenv from "dotenv";

dotenv.config();

// Redis 인스턴스
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// 1) 일반 API용: 1분(60초)당 최대 60회 요청 허용
export const generalRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(60, "60 s"),
  prefix: "@ratelimit/general",
});

// 2) 민감한 API(로그인/회원가입/비밀번호 찾기)용: 1분당 최대 5회만 허용
export const authRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "@ratelimit/auth",
});
```

---

### 4-3. Express 미들웨어로 Rate Limit 구현

요청을 가로채서 제한을 검사하는 재사용 가능한 미들웨어를 작성합니다.

📁 **`src/middleware/rateLimiter.js`**
```javascript
import { generalRatelimit, authRatelimit } from "../utils/ratelimit.js";

// 클라이언트 식별자(IP 주소 또는 로그인한 유저 ID) 추출 헬퍼 함수
const getClientIdentifier = (req) => {
  // 로그인한 유저라면 user ID를 기준으로, 아니면 IP 주소를 기준으로 제한
  if (req.user && req.user._id) {
    return `user:${req.user._id}`;
  }
  return req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip || "127.0.0.1";
};

// 1. 일반 API용 Rate Limit 미들웨어
export const rateLimitMiddleware = async (req, res, next) => {
  try {
    const identifier = getClientIdentifier(req);
    const { success, limit, remaining, reset } = await generalRatelimit.limit(identifier);

    // 표준 RateLimit 응답 헤더 추가
    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", reset);

    // 제한 초과 시 429 Too Many Requests 반환
    if (!success) {
      return res.status(429).json({
        success: false,
        message: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해 주세요.",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limit check error:", error);
    // Rate limit 검사 중 오류가 발생하더라도 서비스가 멈추지 않도록 통과(Fail-Open)
    next();
  }
};

// 2. 인증(로그인/회원가입) 전용 강력한 Rate Limit 미들웨어
export const authRateLimitMiddleware = async (req, res, next) => {
  try {
    const identifier = getClientIdentifier(req);
    const { success, limit, remaining } = await authRatelimit.limit(`auth:${identifier}`);

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);

    if (!success) {
      return res.status(429).json({
        success: false,
        message: "로그인 시도가 너무 많습니다. 1분 후 다시 시도해 주세요.",
      });
    }

    next();
  } catch (error) {
    console.error("Auth Rate limit error:", error);
    next();
  }
};
```

---

### 4-4. 특정 라우트에 적용하기

작성한 미들웨어를 Express 라우터나 서버 엔트리포인트에 연결합니다.

📁 **전체 서버에 일괄 적용할 때 (`server.js`)**:
```javascript
import express from "express";
import { rateLimitMiddleware } from "./src/middleware/rateLimiter.js";

const app = express();
app.use(express.json());

// 모든 API 라우트에 기본 Rate Limit 적용
app.use("/api", rateLimitMiddleware);
```

📁 **특정 라우트(예: 로그인)에만 개별 적용할 때 (`src/routes/authRoute.js`)**:
```javascript
import express from "express";
import { authRateLimitMiddleware } from "../middleware/rateLimiter.js";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

// 로그인/회원가입 엔드포인트에 5회 제한 미들웨어 적용
router.post("/login", authRateLimitMiddleware, login);
router.post("/register", authRateLimitMiddleware, register);

export default router;
```

---

## 5. 자주 묻는 질문 & 주의사항

### Q1. `SyntaxError: The requested module '@upstash/ratelimit' does not provide an export named 'RateLimit'` 에러가 납니다.
- **원인**: 라이브러리의 클래스 이름 철자가 `RateLimit`이 아닌 **`Ratelimit`**(소문자 `l`)입니다.
- **해결**:
  ```javascript
  // ❌ 잘못된 코드
  import { RateLimit } from "@upstash/ratelimit";

  // ✅ 올바른 코드
  import { Ratelimit } from "@upstash/ratelimit";
  ```

### Q2. 프록시(Nginx, Vercel, Cloudflare, Heroku 등) 환경에서 모든 사용자의 IP가 동일하게 잡힙니다.
- `app.set("trust proxy", 1);` 설정을 Express `server.js` 상단에 추가하고, `req.headers["x-forwarded-for"]` 또는 `req.ip`를 통해 실제 클라이언트의 원본 IP를 확인하도록 설정하세요.

### Q3. 로컬 개발 환경에서 테스트할 때 팁
- 횟수 제한이 제대로 작동하는지 확인하려면 `slidingWindow(3, "10 s")` (10초에 3회)와 같이 작게 설정한 뒤, 브라우저나 Postman으로 연속 새로고침/요청을 보내 4번째 요청에서 `429 Too Many Requests` 상태 코드가 반환되는지 확인하면 됩니다.
