import React, { useRef, useEffect, useState } from 'react';

import styled from "styled-components";

import Orderbookdepth from './components/Orderbookdepth';
import Ticker from './components/Ticker';
import Transaction from './components/Transaction';

import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const miniChartOptions = {
  // responsive: true,
  plugins: {
    legend: { // 타이틀 없애기
      display: false,
    }
  },
  elements: { // 각 점 없애기
    point: {
      radius: 0.5,
    },
  },
  animation: false, // 차트 그릴 때 애니메이션
  scales: { // 스케일 x, y 없애기
    y: {
      display: false
    },
    x: {
      display: false
    }
  }
};

function App() {
  const [socketConnected, setSocketConnected] = useState(false);
  const [ticker, setTicker] = useState({});
  const [transactions, setTransaction] = useState([]);
  const [orderbookdepth, setOrderbookdepth] = useState({});
  const [orderbookdepthAskList, setOrderbookdepthAskList] = useState({});
  const [orderbookdepthBidList, setOrderbookdepthBidList] = useState({});
  const [info24, setInfo24] = useState({});
  const [currentPrice, setCurrentPrice] = useState({
    labels: [],
    datasets: [
      {
        label: "BTC 현재가격 변동",
        data: [],
        fill: true,
        borderColor: "rgb(255, 99, 132)",
      },
    ],
  });
  const [tmpChartData, setTmpChartData] = useState({
    labels: [],
    datasets: [{
      label: '',
      data: []
    }]
  })

  const webSocketUrl = 'wss://pubwss.bithumb.com/pub/ws';
  let ws = useRef(null);

  const orderSort = (orderList) => {
    return Object.keys(orderList).sort().reduce(
      (newObj, key) => {
        newObj[key] = orderList[key];
        return newObj;
      }, {}
    )
  }

  // 소켓 객체 생성
  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(webSocketUrl);
      ws.current.onopen = () => {
        console.log(`CONNECTED TO ${webSocketUrl}`);
        setSocketConnected(true);
      };
      ws.current.onclose = (error) => {
        console.log(`DISCONNECT from ${webSocketUrl}`);
        console.log(error)
      };
      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === 'ticker') {
          // console.log(currentPrice.datasets.data)
          setTicker(data.content)
          setCurrentPrice(prev => ({
            labels: [...prev.labels, ""].slice(-30),
            datasets: [
              {
                ...prev.datasets[0],
                data: [...prev.datasets[0].data, parseInt(data.content.prevClosePrice) + parseInt(data.content.chgAmt)].slice(-30)
              }
            ]
          }))
          if (data.content.tickType === '24H') {
            setInfo24({ volume: data.content.volume, value: data.content.value })
          }
        }

        if (data.type === 'transaction') {
          setTransaction(prevTransaction => [...prevTransaction, ...data.content.list].slice(-20))
        }

        if (data.type === 'orderbookdepth') {
          const res = data.content.list
          for (let i=0; i<res.length; i++) {
            const {orderType, price, quantity} = res[i];
            if (orderType === 'ask') {
              setOrderbookdepthAskList(prevAsk => ({
                ...prevAsk,
                [price]: parseFloat(quantity)
              }))
            } else if (orderType === 'bid') {
              setOrderbookdepthBidList(prevAsk => ({
                ...prevAsk,
                [price]: parseFloat(quantity)
              }))
            }
          }
          setOrderbookdepthAskList(prevAsk => (orderSort({...prevAsk})))
          setOrderbookdepthBidList(prevBid => (orderSort({...prevBid})))
          setOrderbookdepth({"symbol": data.content.list[0].symbol})
        }
      }
    }
    return () => {
      console.log("clean up");
      ws.current.close();
    }
  }, [])

  // 소켓 연결시 send 메소드
  useEffect(() => {
    if (socketConnected) {
      console.log('send')
        
      const subscribeTickerData = {
        "type": "ticker",
        "symbols": ["BTC_KRW"],
        "tickTypes": ["MID", "24H"],
      }
      const subscribeTransactionData = {
        "type": "transaction",
        "symbols": ["BTC_KRW"],
      }
      const subscribeOrderbookdepthData = {
        "type": "orderbookdepth",
        "symbols": ["BTC_KRW"],
      }
      
      ws.current.send(
        JSON.stringify(subscribeTickerData)
      );

      ws.current.send(
        JSON.stringify(subscribeTransactionData)
      )

      ws.current.send(
        JSON.stringify(subscribeOrderbookdepthData)
      )
    }
  }, [socketConnected])

  // 현재가 폴링
  const publicAPIUrl = 'https://api.bithumb.com/public';
  useEffect(() => {
    setInterval(() => {
      const orderCurrency = 'ALL';
      const paymentCurrency = 'KRW'
      fetch(`${publicAPIUrl}/ticker/${orderCurrency}_${paymentCurrency}`)
      .then(res => res.json())
    }, 3000);
  }, [])

  // 캔들스틱 가격 API 테스트
  const candelstickAPIUrl = 'https://api.bithumb.com/public/candlestick'
  const chartIntervals = '10m'
  useEffect(() => {
    fetch(`${candelstickAPIUrl}/BTC_KRW/${chartIntervals}`)
    .then(res => res.json())
    // .then(res => console.log(res))
    .then(res => {
      console.log('mydata', res.data)
      if (res.data) {
        const renderData = res.data.slice(-150).filter(info => new Date(info[0]).getMinutes() % 10 === 0);
        setTmpChartData({
          labels: renderData.map(info => `${new Date(info[0]).getHours()}:${new Date(info[0]).getMinutes()}`),
          datasets: [{
            label: 'TMPCHARTDATA',
            data: renderData.map(info => info[2]),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)'
          }],
        })
      }
    })
  }, [])

  return (
    <Container>
      <NavBar>Bithumb x codestates coin market</NavBar>
      {/* 정보 */}
      <Main>
        {/* <Line type="line" data={currentPrice} options={options} /> */}
        <Line type="line" data={tmpChartData} options={''}/>
      </Main>
      <SideBar>
      {/* 호가 */}
      {Object.keys(orderbookdepth).length > 0 ? (
        <Orderbookdepth orderbookdepth={orderbookdepth} orderbookdepthAskList={orderbookdepthAskList} orderbookdepthBidList={orderbookdepthBidList} />
        ) : ''}
      </SideBar>
      <ContentBox>
      <Content1>
      {Object.keys(ticker).length > 0 ? (
        <Ticker ticker={ticker} info24={info24} />
        ) : "" }
        <Line type="line" data={tmpChartData} options={miniChartOptions}/>
      </Content1>
      <Content2>
      {/* 체결 내역 */}
      {transactions.length > 0 ? (
        <Transaction transactions={transactions} />) : ''}
      </Content2>
      <Content3>

        </Content3>
      </ContentBox>
      <Footer>김덕기(프론트엔드)</Footer>
    </Container>
  );
}

export default App;

const Container = styled.div`
  display: grid;
  height: 100vh;
  color: white;
  grid-template-rows: 0.2fr 1fr 0.5fr 0.5fr;
  grid-template-areas:
    "nav nav nav nav"
    "sidebar main main main"
    "sidebar content content content"
    "sidebar footer footer footer";
  text-align: center;
  grid-gap: 0.25rem;
`;

const NavBar = styled.nav`
  background: #3a3a55;
  grid-area: nav;
  padding: 0.25rem;
`;

const Main = styled.main`
  /* background: #1f2128; */
  width: 60%;
  color: white;
  grid-area: main;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SideBar = styled.div`
  background: #9aaab7;
  grid-area: sidebar;
  padding: 0.25rem;
  display:flex;
  justify-content: center;
  align-items: center;
`;

const ContentBox = styled.div`
  display: flex;
  gap: 0.25rem;
  /* padding: 0.25rem; */
  align-items: center;
  grid-area: content;
  justify-content: center;
`;

const Content1 = styled.div`
  background: #a6b8b9;
  padding: 0.25rem;
  width: 100%;
  height: 220px;
  overflow-y: auto;
  overflow-x:hidden;
`;
const Content2 = styled(Content1)``;
const Content3 = styled(Content1)``;
const Footer = styled.footer`
  background: #ff9637;
  grid-area: footer;
  padding: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// const Container = styled.div`
//   display: grid;
//   height: 100vh;
//   grid-template-rows: 0.2fr 1fr 0.5fr 0.5fr;
//   grid-template-areas:
//     "nav nav nav nav"
//     "sidebar main main main"
//     "sidebar content content content"
//     "sidebar footer footer footer";
//   text-align: center;
//   grid-gap: 0.25rem;
//   transition: all 0.25s ease-in-out;
//   @media (max-width: 550px) {
//     grid-template-columns: 1fr;
//     grid-template-rows: 0.4fr 0.4fr 2.2fr 1.2fr 1fr;
//     grid-template-areas:
//       "nav"
//       "sidebar"
//       "main"
//       "content"
//       "footer";
//   }
//   color: white;
// `;
// const ContentBox = styled.div`
//   display: flex;
//   gap: 0.25rem;
//   padding: 0.25rem;
//   align-items: center;
//   grid-area: content;
//   justify-content: center;
//   @media (max-width: 550px) {
//     flex-direction: column;
//   }
// `;
