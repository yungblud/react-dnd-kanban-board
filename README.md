# React DnD Kanban Board

README 필수 사항 및 각각 프로젝트의 큰 맥락들을 종합하였습니다.

## Run (실행 방법)

- git clone https://github.com/yungblud/react-dnd-kanban-board
- cd react-dnd-kanban-board
- npm install
- npm run dev

## Specs (기술 스택)

- Vite + React + Typescript (Simple Project용으로 선택)
- Package Manager: npm v10.9.0 (with node v22.11.0)
- Code Formatter: eslint + prettier + lefthook (pre-commit commitlint)
- Styles: emotion (css in js용으로 style prop을 원활히 관리하기 위하여 선택)
- Form: form validation 및 form state 관리를 구현하기 위해 react-hook-form을 사용하였습니다
- Server State: react-query (서버 상태를 관리하기 위함)
- modal UI를 구현하기 위해 overlay-kit을 사용하였습니다

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

## 구현 기능 리스트

- [x] 1-1. 컬럼 조회
- [x] 1-2. 컬럼 생성
- [x] 1-3. 컬럼 수정
- [x] 1-4. 컬럼 삭제
- [x] 2-1. 카드 생성
- [x] 2-2. 카드 조회 (상세 보기)
- [x] 2-3. 카드 수정
- [x] 2-4. 카드 삭제
- [x] 3-1. 카드 이동 (컬럼 간)
- [x] 3-2. 카드 순서 변경 (동일 컬럼 내)
- [x] 3-3. 드래그 UX
- [x] 4-1. Mock API 구현
- [x] 4-2. 데이터 패칭
  - 캐싱: staleTime, gcTime 따로 설정하지 않음
  - 로딩 상태: 따로 표기하지 않음 (대부분의 Update는 낙관적 업데이트 + 에러 롤백이 진행되므로 로딩 없이 보여주는게 UX상 낫다는 판단 like offline-first)
  - 에러 상태: 따로 표기하지 않음 (대부분의 Update는 낙관적 업데이트 + 에러 롤백이 진행되므로 크리티컬한 에러가 아닌 것으로 판단 후 미노출 하는 것이 UX상 낫다는 판단 like offline-first)
- [x] 4-3. 상태 관리
  - 모달 열림/닫힘 상태
  - 현재 드래그 중인 카드 정보
- [x] 5-1. API 에러 처리: UI 따로 표기하지 않음 (대부분의 Update는 낙관적 업데이트 + 에러 롤백이 진행되므로 크리티컬한 에러가 아닌 것으로 판단 후 미노출 하는 것이 UX상 낫다는 판단 like offline-first), 낙관적 업데이트 + 에러 롤백만 진행
- [x] 5-2. 유효성 검사
- [x] 5-3. 빈 상태 처리

## 설계 결정

- 상태 관리 전략: Notion과 같은 Offline First 방식을 염두해두고 작업했습니다 (react-query optimistic update 다수 적용)
- 컴포넌트 설계 원칙
  - 작은 규모의 프로젝트라서 ui 폴더에 component들을 담았습니다
  - 불필요한 리렌더를 방지하고자 memoize를 활용했습니다
  - 불필요한 리렌더를 방지하고자 zustand store 조건부 구독하며 관심사를 분리하였습니다
- 기타 고민했던 부분과 결정 사항
  - offline first 방식과 비슷하게 하려고 했던 부분
  - 카드 드래그 시, 불필요한 리렌더링 방지 (성능 최적화) 부분
  - modal에서 overlayId 값을 기반으로 stack 구조를 활용해 esc키를 누르면 차례대로 닫히도록 구현하였습니다

## 개선하고 싶은 점 (선택)

- 추가 시간이 있었다면 개선하고 싶은 부분
  - api 자체를 offline first 방식에 맞추어 보는 것도 괜찮은 방식이라는 생각이 들었습니다
    - card create api: id 자체를 클라이언트에서 받는다
    - 지금은 column list api 및 card detail api가 조회의 전부이지만, cards by column id 등의 GQL 방식처럼 바꾸게 되면 render to fetch 형태도 가능할 것으로 생각했습니다 (기본적으로 모두 전체 데이터를 불러오는 것이 아닌, 필요한 데이터를 render to fetch)
    - autofill (자동완성 클릭 시) isExpired color 처리

## Misc

- Font: NotoSans KR 적용하였습니다
- create card -> optimistic update 시, client-side에서 `crypto.randomUUID()`를 id로 부여하는데, 서버에서 transaction이 완료되기 전 move card api를 콜하게 되면 not found 가 뜨는 이슈가 있습니다. 해당 부분은 실무에서는 client-side에서 직접 id 값을 http로 전송하면 되는 개선되는 부분이라고 생각하여 굳이 수정하진 않았습니다.

🧪 문서를 꼼꼼히 읽었습니다
