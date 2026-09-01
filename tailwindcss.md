# Vite + React 프로젝트에 Tailwind CSS 적용 가이드

이 문서는 Vite 기반의 React 프로젝트(`frontend`)에 최신 **Tailwind CSS (v4)**를 설치하고 설정하는 전체 과정을 쉽고 자세하게 정리한 가이드입니다.

---

## 📌 개요

Tailwind CSS v4는 Vite 전용 공식 플러그인(`@tailwindcss/vite`)을 제공하여, 기존(v3)처럼 `tailwind.config.js`나 `postcss.config.js` 같은 복잡한 설정 파일 없이 **플러그인 추가와 CSS import 단 한 줄**로 설정이 완료됩니다.

---

## 🚀 단계별 적용 절차

### 1단계: 패키지 설치

`frontend` 폴더로 이동하여 Tailwind CSS와 Vite 전용 플러그인을 설치합니다.

```bash
cd frontend
npm install tailwindcss @tailwindcss/vite
```

* **`tailwindcss`**: Tailwind CSS 핵심 엔진
* **`@tailwindcss/vite`**: Vite 환경에서 Tailwind를 빠르게 빌드/처리해 주는 전용 플러그인

---

### 2단계: Vite 설정 파일 (`vite.config.js`) 수정

Vite 설정 파일에 `@tailwindcss/vite` 플러그인을 불러와 등록합니다.

* **파일 경로**: `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. Tailwind 플러그인 import

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. plugins 배열에 추가
  ],
})
```

---

### 3단계: 전역 CSS 파일 (`index.css`)에 Tailwind import

애플리케이션의 최상위 CSS 파일(`index.css`) 맨 위에 Tailwind 지시어를 선언합니다.

* **파일 경로**: `frontend/src/index.css`

```css
@import "tailwindcss";
```

> **참고**: `main.jsx`에서 `import "./index.css";`가 포함되어 있는지 확인합니다.

---

### 4단계: 컴포넌트에서 Tailwind 클래스 사용

이제 모든 React 컴포넌트의 JSX에서 `className` 속성으로 Tailwind 유틸리티 클래스를 바로 사용할 수 있습니다.

* **사용 예시 (`src/App.jsx` 또는 각 페이지 컴포넌트)**:

```jsx
function HomePage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Tailwind CSS 적용 완료! 🎉
        </h1>
        <p className="text-slate-600 mb-4">
          유틸리티 클래스로 빠르고 쉽게 스타일링할 수 있습니다.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
          버튼 클릭
        </button>
      </div>
    </div>
  );
}

export default HomePage;
```

---

### 5단계: 개발 서버 실행 및 빌드 확인

설정이 정상적으로 완료되었는지 확인합니다.

```bash
# 개발 서버 실행 (HMR 핫리로드 지원)
npm run dev

# 프로덕션 빌드 테스트
npm run build
```

---

## 💡 추가 팁 & 자주 묻는 질문

### Q1. 기존 Tailwind v3와 무엇이 다른가요?
* **v3**: `postcss.config.js`, `tailwind.config.js` 생성 및 `content: ["./src/**/*.{js,jsx}"]` 경로 지정 필수
* **v4**: `@tailwindcss/vite` 플러그인이 소스 파일을 자동으로 감지하므로 별도의 설정 파일 생성이 필요 없습니다.

### Q2. 커스텀 폰트나 색상 테마를 추가하고 싶다면?
`src/index.css`의 `@import "tailwindcss";` 하단에 `@theme` 지시어를 사용해 바로 정의할 수 있습니다.

```css
@import "tailwindcss";

@theme {
  --color-brand-primary: #3b82f6;
  --font-display: "Pretendard", sans-serif;
}
```
