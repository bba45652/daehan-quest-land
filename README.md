# 대한 퀘스트 랜드 🎮

초등학교 남자아이를 위한 AI 기반 습관 형성 앱

## 앱 소개

**대한 퀘스트 랜드**는 아이가 숙제, 독서, 양치, 준비물 챙기기 같은 일상 습관을 완료하면 XP(경험치)를 얻고, 쌓인 XP로 실제 보상을 교환할 수 있는 게임형 습관 형성 앱입니다.

로블록스 스타일의 퀘스트 & 레벨업 시스템으로 "잔소리 앱"이 아닌 진짜 게임처럼 느껴지게 설계했습니다.

## 디자인 시스템

Claude Design 기반 — 밝은 스카이블루 캔버스 (#EAF4FF), 진한 네이비 잉크 (#0B2545), 청키 3D 버튼, 3px 두꺼운 테두리

마스코트 **"토리"** — 한국 전통 갓을 쓴 블록형 호랑이 캐릭터 (SVG, 외부 에셋 없음)

## 주요 기능

- 🎯 **오늘의 퀘스트** — 매일 새로운 퀘스트 제공 (일일 리셋)
- ⭐ **XP 시스템** — 퀘스트 완료 시 XP 획득, 레벨업
- 🔥 **스트릭 시스템** — 연속 퀘스트 완료 일수 추적
- 🏅 **뱃지 시스템** — 도전 조건 달성 시 자동 획득
- 🎁 **보상 상점** — XP로 실생활 보상 교환 (부모 승인)
- 👨‍👩‍👧‍👦 **부모 관리 화면** — 보상/퀘스트 추가·삭제, AI 추천 (PIN 보호)

## 화면 구성

| 화면 | 설명 |
|------|------|
| 홈 | 캐릭터 · 레벨 · XP바 · 스트릭 · 퀘스트 미리보기 |
| 퀘스트 | 전체 퀘스트 목록 · 완료 처리 |
| XP 상점 | 친구 수집 · 실생활 보상 교환 |
| 뱃지 | 획득 뱃지 갤러리 · 통계 |
| 부모 관리 | 보상/퀘스트 설정 (PIN 잠금) |
| 퀘스트 완료 | 축하 화면 (confetti + XP 애니메이션) |
| 레벨업 | 레벨업 축하 풀스크린 |

## 기술 스택

- **React Native** + **Expo SDK 50**
- **React Navigation 6** (Bottom Tabs + Stack)
- **react-native-svg** — 마스코트 SVG 렌더링
- **expo-linear-gradient** — 그라디언트 배경
- **AsyncStorage** — 로컬 데이터 영속성
- **Context API + useReducer** — 전역 상태 관리

## 시작하기

```bash
# 의존성 설치
npm install

# Expo 개발 서버 시작
npm start

# iOS
npm run ios

# Android
npm run android
```

## 폴더 구조

```
src/
├── context/
│   └── GameContext.js     # 전역 상태 (XP, 퀘스트, 보상, 뱃지)
├── screens/
│   ├── HomeScreen.js
│   ├── QuestScreen.js
│   ├── ShopScreen.js
│   ├── BadgesScreen.js
│   ├── ParentScreen.js
│   ├── QuestCompleteScreen.js
│   └── LevelUpScreen.js
├── components/
│   ├── HeroChar.js        # "토리" 마스코트 SVG
│   └── GameUI.js          # 공통 UI 컴포넌트
└── styles/
    └── theme.js           # 색상 · 디자인 토큰
```

## AI 활용 계획

- 퀘스트 난이도 자동 추천 (아이 완료율 기반)
- 아이 성향에 맞는 퀘스트 문구 자동 생성
- 보상 적절성 분석 및 부모 피드백 제공
