import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { fetchCoin, fetchOrderBook, fetchTransactionHistory } from '../api';

import CandlestickChart from '../components/CandlestickChart';
import CoinActiveChart from '../components/CoinActiveCahrt';
import Loader from '../components/Loader';
import TransactionContainer from '../components/TransactionContainer';
import PriceInfoContainer from '../components/PriceInfoContainer';
import OrderBook from '../components/OrderBook';
import CoinListTable from '../components/CoinListTable';
import TRCoinList from '../components/TRCoinList';

import logo from '../images/logo192.png';

function TradeOrder() {
	const params = useParams();
	const [orderCurrency, paymentCurrency] = params.coinId.split('_');
	// const { isLoading: orderBookLoading, data: initialOrderBookData } = useQuery(
	// 	[orderCurrency, 'order book'],
	// 	() => fetchOrderBook(orderCurrency, paymentCurrency),
	// );
	// console.log('orderbook', orderBookLoading, initialOrderBookData);
	const { isLoading: transactionHistoryLoading, data: initialTransactionHistoryData } = useQuery(
		[orderCurrency, 'transaction history'],
		() => fetchTransactionHistory(orderCurrency, paymentCurrency, 30),
	);
	const { isLoading: tickerLoading, data: initialTickerData } = useQuery(
		[orderCurrency, 'initial ticker'],
		() => fetchCoin(orderCurrency, paymentCurrency),
	);

	const [socketConnected, setSocketConnected] = useState(false);
	const [ticker, setTicker] = useState({});

	const [transactions, setTransaction] = useState([]);

	const [orderbookdepth, setOrderbookdepth] = useState({});
	const [orderbookdepthAskList, setOrderbookdepthAskList] = useState({});
	const [orderbookdepthBidList, setOrderbookdepthBidList] = useState({});

	const webSocketUrl = 'wss://pubwss.bithumb.com/pub/ws';
	let ws = useRef(null);

	const orderSort = useCallback(orderList => {
		return Object.keys(orderList)
			.sort((a, b) => a - b)
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

				if (data.type === 'ticker' && data.content.tickType === 'MID') {
					setTicker(prev => ({
						...prev,
						...data.content,
					}));
				}
				if (data.type === 'ticker' && data.content.tickType === '24H') {
					setTicker(prev => ({
						...prev,
						volume: data.content.volume,
						value: data.content.value,
					}));
				}

				if (data.type === 'transaction') {
					setTransaction(data.content.list);
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

	useEffect(() => {
		setOrderbookdepth({});
		setOrderbookdepthAskList({});
		setOrderbookdepthBidList({});
	}, [orderCurrency]);

	if (transactionHistoryLoading || tickerLoading) {
		return '';
	}
	return (
		<Container>
			<NavBar>
				<Link to="/codestates-bithumb-frontend">
					<img src={logo} alt="logo" />
				</Link>
			</NavBar>
			{/* 메인차트 */}
			<Main>
				<CandlestickChart
					orderCurrency={orderCurrency}
					paymentCurrency={paymentCurrency}
					chartIntervals="30m"
				/>
			</Main>
			<SideBar>
				<TRCoinList />
			</SideBar>
			<ContentBox>
				<Content1>
					{/* 코인 정보 */}
					<PriceInfoContainer
						orderCurrency={orderCurrency}
						paymentCurrency={paymentCurrency}
						initialData={initialTickerData.data}
						addedData={ticker}
					/>
					{/* 미니 차트 */}
					<CoinActiveChart
						orderCurrency={orderCurrency}
						paymentCurrency={paymentCurrency}
						chartIntervals="10m"
						width="420px"
						height="150px"
					/>
					{/* 체결 내역 */}
					<TransactionContainer
						orderCurrency={orderCurrency}
						paymentCurrency={paymentCurrency}
						initialData={initialTransactionHistoryData.data}
						addedData={transactions}
					/>
				</Content1>
				<Content2>
					{/* 호가 */}
					{Object.keys(orderbookdepth).length > 0 ? (
						<OrderBook
							orderbookdepth={orderbookdepth}
							orderbookdepthAskList={orderbookdepthAskList}
							orderbookdepthBidList={orderbookdepthBidList}
							closingPrice={initialTickerData.data.prev_closing_price}
						/>
					) : (
						''
					)}
				</Content2>
				{/* <Content3 /> */}
			</ContentBox>
			<Footer />
		</Container>
	);
}

export default TradeOrder;

const Container = styled.div`
	display: grid;
	height: 140vh;
	width: 1200px;
	margin: auto;
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
	/* background: #3a3a55; */
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
	/* background: #9aaab7; */
	grid-area: sidebar;
	padding: 0.5rem;
	/* display: flex;
	justify-content: center;
	align-items: center; */
	overflow-y: scroll;
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
const Footer = styled.footer`
	/* background: #ff9637; */
	grid-area: footer;
	padding: 0.25rem;
	display: flex;
	justify-content: center;
	align-items: center;
	/* height: 100px; */
`;
