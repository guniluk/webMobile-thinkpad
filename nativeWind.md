# 🍃 Expo 프로젝트에 NativeWind (Tailwind CSS) 완벽 적용 가이드

> **NativeWind**는 React Native 및 Expo 프로젝트에서 **Tailwind CSS의 유틸리티 클래스(`className`)**를 그대로 사용하여 빠르고 아름다운 모바일 UI를 개발할 수 있도록 돕는 스타일링 프레임워크입니다.

---

## 📑 목차

1. [⚙️ 1단계: 필수 패키지 설치](#️-1단계-필수-패키지-설치)
2. [📄 2단계: Tailwind 설정 파일 (`tailwind.config.js`)](#-2단계-tailwind-설정-파일-tailwindconfigjs)
3. [🎨 3단계: 전역 CSS 파일 생성 (`global.css`)](#-3단계-전역-css-파일-생성-globalcss)
4. [🚇 4단계: Metro 번들러 설정 (`metro.config.js`)](#-4단계-metro-번들러-설정-metroconfigjs)
5. [🔄 5단계: Babel 트랜스파일러 설정 (`babel.config.js`)](#-5단계-babel-트랜스파일러-설정-babelconfigjs)
6. [📱 6단계: 루트 레이아웃에 CSS 임포트 (`_layout.jsx`)](#-6단계-루트-레이아웃에-css-임포트-_layoutjsx)
7. [🛠️ 7단계: 타입 선언 및 VS Code 에러 방지 설정](#️-7단계-타입-선언-및-vs-code-에러-방지-설정)
8. [💡 8단계: 컴포넌트 작성 및 실전 사용 예제](#-8단계-컴포넌트-작성-및-실전-사용-예제)
9. [❓ 자주 발생하는 문제 및 트러블슈팅 (FAQ)](#-자주-발생하는-문제-및-트러블슈팅-faq)

---

## ⚙️ 1단계: 필수 패키지 설치

Expo 프로젝트 폴더(`mobile/`)에서 NativeWind v4 및 Tailwind CSS 관련 의존성을 설치합니다.

```bash
cd mobile

# NativeWind 및 Tailwind CSS 설치
npm install nativewind tailwindcss react-native-reanimated react-native-safe-area-context
```

---

## 📄 2단계: Tailwind 설정 파일 (`tailwind.config.js`)

프로젝트 루트(`mobile/`)에 `tailwind.config.js` 파일을 생성하고, NativeWind 프리셋과 컴포넌트 경로를 지정합니다.

```javascript
// mobile/tailwind.config.js
/** @type {import("tailwindcss").Config} */
module.exports = {
  // 스타일을 적용할 파일들의 경로 지정 (Expo Router 사용 시 ./src 또는 ./app)
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5",
          light: "#6366f1",
          dark: "#4338ca",
        },
      },
    },
  },
  plugins: [],
};
```

---

## 🎨 3단계: 전역 CSS 파일 생성 (`global.css`)

프로젝트 루트(`mobile/`)에 `global.css` 파일을 생성합니다.

```css
/* mobile/global.css */
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

> 💡 **Tip**: `@tailwind base;` 대신 표준 CSS 구문인 `@import "tailwindcss/...";`를 사용하면 VS Code에서 발생하는 "Unknown at rule @tailwind" 경고를 깔끔하게 방지할 수 있습니다.

---

## 🚇 4단계: Metro 번들러 설정 (`metro.config.js`)

Expo의 Metro 번들러가 Tailwind CSS를 네이티브 스타일로 변환할 수 있도록 `withNativeWind` 래퍼를 적용합니다.

```javascript
// mobile/metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

---

## 🔄 5단계: Babel 트랜스파일러 설정 (`babel.config.js`)

React Native 컴포넌트의 `className` 속성을 네이티브 `style` 객체로 컴파일하도록 Babel 설정을 추가합니다.

```javascript
// mobile/babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

---

## 📱 6단계: 루트 레이아웃에 CSS 임포트 (`_layout.jsx`)

Expo Router의 최상단 레이아웃 파일(`src/app/_layout.jsx`) 최상단에 `global.css`를 임포트합니다.

```javascript
// mobile/src/app/_layout.jsx
import "../../global.css"; // 👈 최상단에서 반드시 임포트!
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
```

---

## 🛠️ 7단계: 타입 선언 및 VS Code 에러 방지 설정

### 1) TypeScript 타입 선언 (`nativewind-env.d.ts`)
JSX 요소에서 `className` 프로퍼티 타입 에러가 발생하지 않도록 `mobile/nativewind-env.d.ts`를 생성합니다.

```typescript
/// <reference types="nativewind/types" />
```

### 2) VS Code 경고 무시 설정 (`mobile/.vscode/settings.json`)
에디터에서 CSS 린트 경고를 비활성화합니다.

```json
{
  "css.lint.unknownAtRules": "ignore",
  "scss.lint.unknownAtRules": "ignore",
  "less.lint.unknownAtRules": "ignore",
  "css.validate": false,
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

## 💡 8단계: 컴포넌트 작성 및 실전 사용 예제

이제 모든 React Native 기본 컴포넌트에서 `className`을 자유롭게 사용할 수 있습니다!

```jsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";

export default function ExampleCard() {
  return (
    // 카드 컨테이너
    <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mx-4 my-2">
      {/* 뱃지 & 상단 헤더 */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
          <Text className="text-xs font-bold text-indigo-600">아이디어</Text>
        </View>
        <Text className="text-xs text-slate-400">2026. 09. 03</Text>
      </View>

      {/* 본문 텍스트 */}
      <Text className="text-lg font-bold text-slate-900 mb-1">
        NativeWind로 모바일 UI 만들기
      </Text>
      <Text className="text-sm text-slate-600 leading-relaxed mb-4">
        웹에서 쓰던 Tailwind CSS 클래스를 그대로 리액트 네이티브에서도 사용할 수 있습니다.
      </Text>

      {/* 버튼 */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-indigo-600 py-3 rounded-2xl flex-row items-center justify-center gap-2 shadow-md shadow-indigo-200"
      >
        <Plus size={16} color="#ffffff" strokeWidth={2.5} />
        <Text className="text-sm font-bold text-white">시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## ❓ 자주 발생하는 문제 및 트러블슈팅 (FAQ)

### Q1. 스타일이 화면에 즉시 반영되지 않거나 흰 화면이 나옵니다.
- **해결책**: 캐시 문제일 가능성이 높습니다. 개발 서버를 중지하고 캐시를 초기화하여 다시 시작하세요:
  ```bash
  npx expo start -c
  ```

### Q2. `className`에 빨간 밑줄(타입 에러)이 생깁니다.
- **해결책**: 루트 폴더에 `nativewind-env.d.ts` 파일이 있는지 확인하고, 에디터(VS Code)를 다시 로드(`Cmd + Shift + P` ➔ `Reload Window`)하세요.

### Q3. `content` 경로에 파일이 누락되어 특정 파일의 스타일이 안 먹힙니다.
- **해결책**: `tailwind.config.js`의 `content` 배열에 해당 파일의 디렉토리가 올바르게 포함되어 있는지 확인하세요:
  ```javascript
  content: ["./src/**/*.{js,jsx,ts,tsx}"]
  ```

---

**NativeWind와 함께 쉽고 빠른 모바일 UI를 개발해보세요! 🚀**
