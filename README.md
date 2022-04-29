# Getting Started with APP

![0429프로젝트GIF1](https://user-images.githubusercontent.com/52899349/165930367-5e027fcd-43ed-4a97-84b0-2124d41fc508.gif)
![0429프로젝트GIF2](https://user-images.githubusercontent.com/52899349/165930394-6c5b21bd-a653-4cab-a949-5e0a0a2a3fb4.gif)

[프로젝트 링크](https://deok2kim.github.io/codestates-bithumb-frontend/)

## 프로젝트 실행 방법

1. `npm install`
2. `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 사용한 스택 목록

1. `javascript`
2. `html`
3. `css`
4. `react`
5. `styled-components`
6. `chartjs`
7. `react-chartjs-2`
8. `apexcharts`
9. `react-helmet`
10. `react-icons`
11. `react-loading`
12. `react-query`
13. `react-router-dom`
14. `styled-reset`

## 구현한 기능 목록 (Software Requirement Specification)

1. `코인에 대한 (오늘)정보 ex.현재가격, 시가, 종가, 거래량 등 표시`
2. `호가 표시`
3. `체결 내역 표시`
4. `현재가를 기준으로 실시간 코인 가격 (그래프) 표시`
5. `코인의 목록`
6. `코인 즐겨찾기`
7. `코인 목록 인피니티 스크롤`
8. `코인 검색`

## 구현 방법 및 구현하면서 어려웠던 점
1. 웹소켓으로 받아오는 가격은 초기에 많지 않아서 데이터가 가득한 화면을 보여주기 어렵기 때문에 API로 초기 데이터를 가져오려고했으나 오더북 데이터가 CORS문제가 발생해서 가져오지 못함.
2. 무한스크롤 부분을 따로따로 구현하지 않아서 즐겨찾기에서는 사용하지 못함
3. 디자인 능력의 한계로 반응형을 적용해서 그리드는 잘 됐으나 컨텐츠가 엉망이 돼서 다시 원상복구함

## 프로토타입
![image](https://user-images.githubusercontent.com/52899349/165931708-ba2f8f0d-fb4e-4a71-b350-015079aae9eb.png)

## 성능 최적화에 대해서 고민하고 개선한 방법

값을 받아와서 쌓을 수록 렌더링할 데이터를 분류해야할 작업이 많아지기 때문에 느려진다고 생각했습니다.
그래서 어느정도 사용자에게 필요한 만큼의 정보만 남기고 지난 데이터나 필요없는 데이터는 삭제했습니다.

-> 자식 컴포넌트 중에 부모 컴포넌트의 리렌더링으로 인해 같이 리렌더링 되는 (상태가 변하지 않아서 리렌더링이 필요 없는)컴포넌트를 `React.memo` 를 통해 최적화
-> useCallback 을 사용해서 한번 만들어진 함수는 재사용

## FAQ, 차후 개선책

1. `속도가 느린점`
- 데이터를 더 최적화
- => 위에서 말한 최적화를 통해 성능을 개선했습니다.

2. `그래프 보기 힘든점`
- 다양한 차트 라이브러리를 찾아보기
-  => ApexChart 라는 라이브러리를 찾아 기존의 차트보다 좋은 결과물을 얻었습니다.

3. `디자인이 별로인점` 
- => 원래의 홈페이지를 보고 비슷하게 만드니 봐줄만해졌습니다.

4. `성능을 더 개선`
- 학습한 결과 React-Saga를 통해 웹소켓으로 받아온 데이터를 즉시 사용하지 않고, 잠깐 보류해 둔 뒤 모아서 사용할 수 있다는 결과를 얻었습니다.
- 하지만 바로 적용하기에는 약간의 장벽이 있어 프로젝트를 마무리하고, 따로 스스로 개선해보기로 했습니다.

5. `웹소켓 연결이 끊어졌을 때`
- 소켓.io 라이브러리는 연결이 끊어졌을 때, 스스로 재 연결을 시도하는 기능이 있다는 것을 알았습니다.
- 이것도 차 후 개선할 생각입니다.

## 참고자료
1. [디자인UI/UX](https://www.bithumb.com/)
2. [차트](https://react-chartjs-2.netlify.app/examples/line-chart)
3. [리액트+웹소켓](https://jcon.tistory.com/186)
4. [styled-component](https://dev.to/dank_programmer321/get-started-with-css-grids-react-styled-components-59pk)
