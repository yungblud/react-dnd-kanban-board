# Hello, This is README.

안녕하세요, 최동호 지원자입니다.
아래에는 Project에 대한 간단한 설명을 담았습니다.

## Specs

- Vite + React + Typescript
- Package Manager: npm
- Code Formatter: eslint + prettier + lefthook (pre-commit commitlint)

## Run

- git clone https://github.com/yungblud/protopie-assignment
- cd protopie-assignment
- npm install
- npm run dev

## Styles

- emotion + css in js 를 사용하였습니다.

## MSW (mock api)

- mock api 서버는 msw를 사용하여 구현하였습니다
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

## Misc

- modal UI를 구현하기 위해 overlay-kit을 사용하였습니다
- form validation 및 form state 관리를 구현하기 위해 react-hook-form을 사용하였습니다
- Font: NotoSans KR 적용하였습니다

🧪 문서를 꼼꼼히 읽었습니다
