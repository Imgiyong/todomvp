# Simple Blue To-Do List (Google Stitch)

이 React 앱은 Google Stitch **Simple Todo / Simple Blue To-Do List** 프로젝트에서 export한 UI를 기반으로 합니다.

## Stitch 디자인 시스템

- **Primary Blue:** `#0050cb`
- **Font:** Inter
- **Icons:** Material Symbols Outlined
- **Layout:** Material Design 3 토큰 (surface, primary-fixed, secondary-container 등)

## 구현된 Stitch 화면

| Stitch 화면 | React 컴포넌트 |
|------------|----------------|
| All Tasks | `AllTasksView.tsx` |
| Active Tasks | `ActiveTasksView.tsx` |
| Completed Tasks | `CompletedTasksView.tsx` |
| Welcome (Empty) | `EmptyWelcome.tsx` |

## Stitch에서 최신 UI 가져오기

1. https://stitch.withgoogle.com 접속 후 로그인
2. **Simple Blue To-Do List** 프로젝트 열기
3. 화면 선택 → **Export** → **Download ZIP** 또는 **Code to clipboard**
4. export한 HTML을 프로젝트에 반영 요청

> Stitch 프로젝트는 Google 계정 로그인이 필요해 AI가 직접 접근할 수 없습니다.
> export한 HTML/ZIP을 공유해 주시면 최신 디자인으로 동기화할 수 있습니다.

## 추가 기능 (Stitch 원본 + 확장)

- 카테고리 분류 (업무/개인/학습/취미)
- 마감일 설정
- 캘린더 뷰
- localStorage 저장
- 드래그 순서 변경
