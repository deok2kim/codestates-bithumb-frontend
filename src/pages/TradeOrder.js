import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

import OrderBook from '../components/OrderBook';
import PriceInfo from '../components/PriceInfo';
import Transaction from '../components/Transaction';

import CandlestickChart from '../components/CandlestickChart';
import { useParams } from 'react-router-dom';
import CoinChart from '../components/CoinChart';
import CoinActiveChart from '../components/CoinActiveCahrt';
import { useCallback } from 'react';

function TradeOrder() {
	console.log('trade_order');
	const params = useParams();
	const [orderCurrency, paymentCurrency] = params.coinId.split('_');
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
				label: 'BTC 현재가격 변동',
				data: [],
				fill: true,
				borderColor: 'rgb(255, 99, 132)',
			},
		],
	});

	const webSocketUrl = 'wss://pubwss.bithumb.com/pub/ws';
	let ws = useRef(null);

	const orderSort = useCallback(orderList => {
		return Object.keys(orderList)
			.sort()
			.reduce((newObj, key) => {
				newObj[key] = orderList[key];
				return newObj;
			}, {});
	}, []);

	// 소켓 객체 생성
	useEffect(() => {
		if (!ws.current) {
			ws.current = new WebSocket(webSocketUrl);
			ws.current.onopen = () => {
				console.log(`CONNECTED TO ${webSocketUrl}`);
				setSocketConnected(true);
			};
			ws.current.onclose = error => {
				console.log(`DISCONNECT from ${webSocketUrl}`);
				console.log(error);
			};
			ws.current.onmessage = e => {
				const data = JSON.parse(e.data);
				if (data.type === 'ticker') {
					setTicker(data.content);
					setCurrentPrice(prev => ({
						labels: [...prev.labels, ''].slice(-30),
						datasets: [
							{
								...prev.datasets[0],
								data: [
									...prev.datasets[0].data,
									parseInt(data.content.prevClosePrice) + parseInt(data.content.chgAmt),
								].slice(-30),
							},
						],
					}));
					if (data.content.tickType === '24H') {
						setInfo24({ volume: data.content.volume, value: data.content.value });
					}
				}

				if (data.type === 'transaction') {
					setTransaction(prevTransaction => [...prevTransaction, ...data.content.list].slice(-20));
				}

				if (data.type === 'orderbookdepth') {
					const res = data.content.list;
					for (let i = 0; i < res.length; i++) {
						const { orderType, price, quantity } = res[i];
						if (orderType === 'ask') {
							setOrderbookdepthAskList(prevAsk => ({
								...prevAsk,
								[price]: parseFloat(quantity),
							}));
						} else if (orderType === 'bid') {
							setOrderbookdepthBidList(prevAsk => ({
								...prevAsk,
								[price]: parseFloat(quantity),
							}));
						}
					}
					setOrderbookdepthAskList(prevAsk => orderSort({ ...prevAsk }));
					setOrderbookdepthBidList(prevBid => orderSort({ ...prevBid }));
					setOrderbookdepth({ symbol: data.content.list[0].symbol });
				}
			};
		}
		return () => {
			console.log('clean up');
			ws.current.close();
		};
	}, []);

	// 소켓 연결시 send 메소드
	useEffect(() => {
		if (socketConnected) {
			console.log('send');

			const subscribeTickerParams = {
				type: 'ticker',
				symbols: [`${orderCurrency}_${paymentCurrency}`],
				tickTypes: ['MID', '24H'],
			};
			const subscribeTransactionParams = {
				type: 'transaction',
				symbols: [`${orderCurrency}_${paymentCurrency}`],
			};
			const subscribeOrderbookdepthParams = {
				type: 'orderbookdepth',
				symbols: [`${orderCurrency}_${paymentCurrency}`],
			};

			ws.current.send(JSON.stringify(subscribeTickerParams));
			ws.current.send(JSON.stringify(subscribeTransactionParams));
			ws.current.send(JSON.stringify(subscribeOrderbookdepthParams));
		}
	}, [orderCurrency, paymentCurrency, socketConnected]);

	return (
		<Container>
			<NavBar>Bithumb x codestates coin market</NavBar>
			{/* 정보 */}
			<Main>
				<CandlestickChart
					orderCurrency={orderCurrency}
					paymentCurrency={paymentCurrency}
					chartIntervals="30m"
				/>
			</Main>
			<SideBar />
			<ContentBox>
				<Content1>
					{Object.keys(ticker).length > 0 ? <PriceInfo ticker={ticker} info24={info24} /> : ''}
					{/* <div style={{ border: '1px solid black', padding: 0 }}>
						<Line type="line" data={tmpChartData} options={miniChartOptions} height={50} />
					</div> */}
					{/* 미니 차트 */}
					<CoinActiveChart
						orderCurrency={orderCurrency}
						paymentCurrency={paymentCurrency}
						chartIntervals="10m"
						width="420px"
						height="150px"
					/>
					{/* 체결 내역 */}
					{transactions.length > 0 ? <Transaction ws={ws} transactions={transactions} /> : ''}
				</Content1>
				<Content2>
					{/* 호가 */}
					{Object.keys(orderbookdepth).length > 0 ? (
						<OrderBook
							orderbookdepth={orderbookdepth}
							orderbookdepthAskList={orderbookdepthAskList}
							orderbookdepthBidList={orderbookdepthBidList}
						/>
					) : (
						''
					)}
				</Content2>
				{/* <Content3 /> */}
			</ContentBox>
			<Footer>김덕기(프론트엔드)</Footer>
		</Container>
	);
}

export default TradeOrder;

const Container = styled.div`
	display: grid;
	height: 120vh;
	width: 1200px;
	/* color: white; */
	margin: auto;
	/* grid-template-rows: 1fr 1fr 0.5fr 1fr; */
	grid-template-rows: 0.2fr 2fr 1.25fr 1.25fr 0.2fr;
	grid-template-areas:
		/* 'nav nav nav nav'
		'sidebar main main main'
		'sidebar content content content'
		'footer footer footer footer'; */
		'nav nav nav'
		'sidebar main main'
		'sidebar content content'
		'sidebar content content'
		'footer footer footer';
	grid-template-columns: 1fr 1.2fr 0.8fr;
	text-align: center;
	/* grid-gap: 0.3rem; */
	/* min-width: 90%; */
`;

const NavBar = styled.nav`
	background: #3a3a55;
	grid-area: nav;
	padding: 0.25rem;
`;

const Main = styled.main`
	/* background: #1f2128; */
	/* width: 60%; */
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
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ContentBox = styled.div`
	display: flex;
	gap: 0.5rem;
	/* padding: 0.25rem; */
	align-items: center;
	grid-area: content;
	justify-content: space-around;
`;

const Content1 = styled.div`
	/* background: #a6b8b9; */
	padding: 0.25rem;
	/* width: 100%; */
	/* height: 600px; */
	/* overflow-y: scroll; */
	overflow-x: hidden;
	/* min-width: 600px; */
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
