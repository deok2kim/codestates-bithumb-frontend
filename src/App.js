import React, { useState, useEffect } from 'react';

// 라우터
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TradeOrder from './pages/TradeOrder';
import NotFound from './components/NotFound';

// 소켓 io 라이브러리
import io from 'socket.io-client';
import { useRef } from 'react';

// css
import GlobalStyles from './GlobalStyles';

// const socket = io.connect('wss://pubwss.bithumb.com/pub/ws', {
//   withCredentials: true,
//   extraHeaders: {
//     "my-custom-header": "abcd"
//   }
// });
// (() => {
//   socket.emit('init', {
//     "type": "ticker",
//     "symbols": ["BTC_KRW"],
//     "tickTypes": ["MID", "24H"],
//   });
//   socket.on('welcome', msg => {
//     console.log(msg)
//   })
// })();

function App() {
	const URL_NAME = 'codestates-bithumb-frontend';
	const [tickers, setTickers] = useState([]);
	// const [socketConnected, setSocketConnected] = useState(false)

	// const WEB_SOCKET_URL = 'wss://pubwss.bithumb.com/pub/ws';
	// let ws = useRef(null);

	// useEffect(() => {
	//   if (!ws.current) {
	//     ws.current = new WebSocket(WEB_SOCKET_URL);
	//     ws.current.onopen = () => {
	//       console.log(`CONNECTED TO ${WEB_SOCKET_URL}`);
	//       setSocketConnected(true)
	//     };
	//     ws.current.onclose = (error) => {
	//       console.log(`DISCONNECT from ${WEB_SOCKET_URL}`);
	//       console.log(error)
	//     }
	//     ws.current.onmessage = (e) => {
	//       const data = JSON.parse(e.data);
	//       console.log(data);
	//     }
	//   }
	//   return () => {
	//     console.log("clean up");
	//     ws.current.close();
	//   }
	// }, [])

	// useEffect(() => {
	//   if (socketConnected) {
	//     console.log('SEND');
	//     const subscribeTickerParams = {
	//       "type": "ticker",
	//       "symbols": "ALL",
	//       "tickTypes": ["MID", "24H"],
	//     }

	//     ws.current.send(
	//       JSON.stringify(subscribeTickerParams)
	//     )
	//   }
	// }, [socketConnected])

	// 현재가 폴링

	const publicAPIUrl = 'https://api.bithumb.com/public';
	useEffect(() => {
		const orderCurrency = 'ALL';
		const paymentCurrency = 'KRW';
		fetch(`${publicAPIUrl}/ticker/${orderCurrency}_${paymentCurrency}`)
			.then(res => res.json())
			.then(res => setTickers(res.data));
		setInterval(() => {
			const orderCurrency = 'ALL';
			const paymentCurrency = 'KRW';
			fetch(`${publicAPIUrl}/ticker/${orderCurrency}_${paymentCurrency}`)
				.then(res => res.json())
				.then(res => setTickers(res.data));
		}, 5000);
	}, []);

	// 필요한것
	// 이름, 실시간(종가), 변동률, 거래금액(24h), 시가총액(optional)
	/*
    코인이름(심볼): {
      closing_price
      flucate_rate_24H
      acc_trade_value_24H
    }
  */

	return (
		<>
			<GlobalStyles />
			<BrowserRouter>
				<Routes>
					<Route path={`${URL_NAME}/`} element={<Home tickers={tickers} />}>
						홈
					</Route>
					<Route path={`${URL_NAME}/trade_order/`} element={<TradeOrder />}>
						어웨이
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
			{/* <TradeOrder /> */}
		</>
	);
}

export default App;
