# Hello, This is README.

안녕하세요, 최동호 지원자입니다.
아래에는 Project에 대한 간단한 설명을 담았습니다.

## Specs

- Vite + React + Typescript (Simple Project용으로 선택)
- Package Manager: npm
- Code Formatter: eslint + prettier + lefthook (pre-commit commitlint)
- Styles: emotion (css in js용으로 style prop을 원활히 관리하기 위하여 선택)
- Form: react-hook-form (복잡한 form input 상태관리용)
- server state: react-query (서버 상태를 관리하기 위함)

## Run

- git clone https://github.com/yungblud/protopie-assignment
- cd protopie-assignment
- npm install
- npm run dev

## MSW (mock api)

- mock api 서버는 msw를 사용하여 구현하였습니다
- 위치는 `src/mocks`에서 관리하고 있습니다
- `.env.development`의 환경변수를 이용하여 제어가 가능합니다
- api prefix로 `/api`를 붙였습니다
- 200 ~ 500ms 사이로 랜덤하게 delay를 붙였습니다
- in memory db 형식을 차용하여 CRUD에 대응 하였습니다

## api fetchers (api-sdk)

- api fetcher 공통 함수는 `src/api`에서 관리합니다
- client side에서 response를 한번 더 zod를 사용하여 safeParse 할 수 있도록 zod util을 활용하였습니다 (`src/types/schema.ts`)

## handle server state

- server state를 관리하기 위해 tanstack react-query를 적용하였습니다
- 각각 필요한 mutation 부분에 적절한 optimistic update를 적용했습니다

## models (DTO)

- model data type은 `src/types/index.ts`에 담아서 재활용 하였습니다

## react-hook-form

- hook form의 isDirty를 활용하여, 저장 (수정 시) 버튼 Conditional Render
- 필요한 Form validation 수행

## Drag + zustand

- drag 효과의 상태를 관리하기 위해 `src/lib/store/drag-store.ts`로 관리하고 있습니다
- 각각의 구독하는 component들은 KanbanCard (카드 drag 효과), KanbanCardPlaceholder (drag placeholder 효과) 이 있습니다
- 구독하는 컴포넌트들의 관심사들을 분리하여 불필요하게 모든 모든 카드나 모든 컬럼이 리렌더링 되는 현상을 방지하였습니다

## Misc

- modal UI를 구현하기 위해 overlay-kit을 사용하였습니다
- form validation 및 form state 관리를 구현하기 위해 react-hook-form을 사용하였습니다
- Font: NotoSans KR 적용하였습니다
- Modal: OverlayId 값을 기반으로 stack 구조를 활용해 esc키를 누르면 차례대로 닫히도록 구현하였습니다
- create card -> optimistic update 시, client-side에서 `crypto.randomUUID()`를 id로 부여하는데, 서버에서 transaction이 완료되기 전 move card api를 콜하게 되면 not found 가 뜨는 이슈가 있습니다. 해당 부분은 실무에서는 client-side에서 직접 id 값을 http로 전송하면 되는 개선되는 부분이라고 생각하여 굳이 수정하진 않았습니다.

🧪 문서를 꼼꼼히 읽었습니다
