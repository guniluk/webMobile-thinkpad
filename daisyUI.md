# Vite + React (Tailwind CSS v4) 환경에 daisyUI 적용 가이드

이 문서는 Vite 기반 React 프로젝트(`frontend`)에 **daisyUI (v5)** 컴포넌트 라이브러리를 설치하고 설정하는 전체 과정을 쉽고 상세하게 정리한 가이드입니다.

---

## 📌 1. 개요

**daisyUI**는 Tailwind CSS 기반의 가장 인기 있는 UI 컴포넌트 라이브러리입니다.
복잡하고 긴 유틸리티 클래스 대신 `btn`, `card`, `modal`, `navbar`와 같은 직관적인 시맨틱 클래스를 제공하여 생산성을 극대화합니다.

* **Tailwind CSS v4 지원**: daisyUI v5부터는 `tailwind.config.js` 없이 CSS 파일 내 `@plugin "daisyui";` 선언만으로 완벽하게 동작합니다.

---

## 🚀 2. 단계별 적용 절차

### 1단계: 패키지 설치

`frontend` 디렉토리로 이동하여 최신 버전의 `daisyui`를 설치합니다.

```bash
cd frontend
npm install daisyui@latest
```

---

### 2단계: CSS 엔트리 파일 (`src/index.css`)에 플러그인 등록

`frontend/src/index.css` 파일에서 `@import "tailwindcss";` 바로 아래에 `@plugin "daisyui";`를 추가합니다.

* **파일 경로**: `frontend/src/index.css`

```css
@import "tailwindcss";
@plugin "daisyui";
```

> **참고**: Tailwind CSS v4 환경에서는 `tailwind.config.js` 파일을 만들거나 수정할 필요가 없습니다.

---

### 3단계: 테마(Theme) 설정 (선택 사항)

daisyUI는 다양한 기본 테마(light, dark, cupcake, synthwave, retro 등)를 내장하고 있습니다.
원하는 테마를 기본으로 적용하려면 `index.html`의 `<html>` 태그에 `data-theme` 속성을 추가합니다.

* **파일 경로**: `frontend/index.html`

```html
<!doctype html>
<html lang="ko" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## 🎨 3. 컴포넌트 사용 예시

### 1) 버튼 (Buttons)
```jsx
<button className="btn">기본 버튼</button>
<button className="btn btn-primary">Primary 버튼</button>
<button className="btn btn-secondary">Secondary 버튼</button>
<button className="btn btn-accent btn-outline">Outline 버튼</button>
```

### 2) 카드 (Cards)
```jsx
<div className="card bg-base-100 w-96 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">daisyUI 카드 컴포넌트</h2>
    <p>손쉽게 멋진 UI 레이아웃을 구성할 수 있습니다.</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">자세히 보기</button>
    </div>
  </div>
</div>
```

### 3) 네비게이션 바 (Navbar)
```jsx
<div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">MyApp</a>
  </div>
  <div className="flex-none">
    <button className="btn btn-square btn-ghost">
      <span className="badge badge-xs badge-primary">NEW</span>
    </button>
  </div>
</div>
```

---

## 🧪 4. 빌드 및 동작 확인

설정이 올바르게 되었는지 확인하기 위해 개발 서버를 실행하거나 빌드를 테스트합니다.

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드 테스트
npm run build
```

빌드 시 터미널에 `/*! 🌼 daisyUI 5.x.x */` 문구가 출력되며 정상 번들링됩니다.

---

## 💡 5. 주요 팁 & FAQ

### Q1. Tailwind v3와 v4의 daisyUI 설정 차이는 무엇인가요?
* **v3**: `tailwind.config.js`의 `plugins: [require("daisyui")]`에 등록
* **v4**: 별도 js 설정 파일 없이 `src/index.css`에 `@plugin "daisyui";`로 선언

### Q2. 지원되는 테마 종류 확인
daisyUI 공식 테마는 `light`, `dark`, `cupcake`, `bumblebee`, `emerald`, `corporate`, `synthwave`, `retro`, `cyberpunk`, `valentine`, `halloween`, `garden`, `forest`, `aqua`, `lofi`, `pastel`, `fantasy`, `wireframe`, `black`, `luxury`, `dracula`, `cmyk`, `autumn`, `business`, `acid`, `lemonade`, `night`, `coffee`, `winter`, `dim`, `nord`, `sunset` 등이 있습니다.
