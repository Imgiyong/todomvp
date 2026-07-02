# Simple Blue To-Do List (Google Stitch)

React 앱 UI는 Google Stitch **Simple Blue To-Do List** export(`simple-blue-todo-list`)와 동기화되어 있습니다.

## Stitch 디자인 시스템

- **Primary Blue:** `#0058be`
- **Font:** Inter
- **Icons:** Material Symbols Outlined
- **Layout:** 모바일 중심 (`max-w-md`), Material Design 3 토큰

## 구현된 Stitch 화면

| Stitch 화면 | React 컴포넌트 |
|------------|----------------|
| 나의 할일 메인 | `TasksView.tsx` |
| 카테고리 | `CategoriesView.tsx` |
| 설정 | `SettingsView.tsx` |
| 하단 네비 | `BottomNav.tsx` |
| 헤더 | `Header.tsx` |
| 음성 입력 FAB | `MicFab.tsx` |

## Stitch에서 최신 UI 가져오기

1. https://stitch.withgoogle.com 접속 후 로그인
2. **Simple Blue To-Do List** 프로젝트 열기
3. 화면 선택 → **Export** → **Download ZIP**
4. export한 HTML을 `simple-blue-todo-list/`에 덮어쓰기 후 동기화 요청

## 데이터 저장

- 할 일 CRUD: **Supabase** (`todos` 테이블)
- UI 설정(탭, 다크모드, 카테고리 필터): **localStorage**
