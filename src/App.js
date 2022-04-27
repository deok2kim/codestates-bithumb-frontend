import React from 'react';

// 라우터
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TradeOrder from './pages/TradeOrder';
import NotFound from './components/NotFound';

// css
import GlobalStyles from './GlobalStyles';

// 리액트 쿼리 데브툴스
import { ReactQueryDevtools } from 'react-query/devtools';

function App() {
	const URL_NAME = 'codestates-bithumb-frontend';

	return (
		<>
			<GlobalStyles />
			<BrowserRouter>
				<Routes>
					<Route path={`${URL_NAME}`} element={<Home />} />
					<Route path={`${URL_NAME}/trade_order/:coinId`} element={<TradeOrder />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
			{/* <ReactQueryDevtools initialIsOpen={true} /> */}
		</>
	);
}

export default App;
