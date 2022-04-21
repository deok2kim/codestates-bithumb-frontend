import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import TopFive from './TopFive';

const objToArr = (tickers, setArr) => {
	setArr(Object.keys(tickers).map(name => ({ name, ...tickers[name] })));
};

function Home({ tickers }) {
	const [tickersArr, setTickersArr] = useState([]);
	const [topFiveList, setTopFiveList] = useState([]);
	const [favoriteCoins, setFavoriteCoins] = useState([]);
	const [mainCategory, setMainCategory] = useState('');

	const getSortTopFive = tickersArr => {
		const newTicker = [...tickersArr]
			.sort((a, b) => b.fluctate_rate_24H - a.fluctate_rate_24H)
			.splice(0, 5);
		setTopFiveList(newTicker);
		return newTicker;
	};
	useEffect(() => {
		getSortTopFive(tickersArr);
	}, [tickersArr]);

	useEffect(() => {
		objToArr(tickers, setTickersArr);
	}, [tickers]);

	// 즐겨찾기
	// const LOCALSTORAGE_FAVORITE_KEY = 'favorite'
	const addFavorite = symbol => {
		const favoriteCoinsInLocalStorage = JSON.parse(localStorage.getItem('favorite') || '[]');
		const indexInFavoriteCoins = favoriteCoinsInLocalStorage.indexOf(symbol);
		if (indexInFavoriteCoins >= 0) {
			favoriteCoinsInLocalStorage.splice(indexInFavoriteCoins, 1);
			localStorage.setItem('favorite', JSON.stringify(favoriteCoinsInLocalStorage));
		} else {
			localStorage.setItem('favorite', JSON.stringify([symbol, ...favoriteCoinsInLocalStorage]));
		}
		setFavoriteCoins(JSON.parse(localStorage.getItem('favorite')));
	};

	useEffect(() => {
		setFavoriteCoins(JSON.parse(localStorage.getItem('favorite')));
		setMainCategory(localStorage.getItem('mainCategory'));
	}, []);

	// 카테고리 (원화 or 즐찾)
	const onChangeMainCategory = category => {
		setMainCategory(category);
		localStorage.setItem('mainCategory', category);
	};

	// 한무 스크롤
	const [target, setTarget] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const nextId = useRef(10);

	const showMoreItems = async () => {
		setIsLoading(true);
		await new Promise(resolve => setTimeout(resolve, 300));
		nextId.current += 10;
		setIsLoading(false);
	};

	const onIntersect = async ([entry], observer) => {
		if (entry.isIntersecting && !isLoading) {
			observer.unobserve(entry.target);
			await showMoreItems();
			observer.observe(entry.target);
		}
	};

	useEffect(() => {
		let observer;
		if (target) {
			observer = new IntersectionObserver(onIntersect, {
				threshold: 0.4,
			});
			observer.observe(target);
		}
		return () => observer && observer.disconnect();
	}, [target]);

	const onStopShowMore = () => {
		return nextId.current < tickersArr.length;
	};

	return (
		<Container>
			<p onClick={objToArr}>메인페이지입니다.</p>
			{/* <TopFive tickersArr={tickersArr}/> */}
			<ul>
				{topFiveList.map(info => (
					<li key={info.name}>
						{info.name}: {info.fluctate_rate_24H}
					</li>
				))}
			</ul>
			<hr />
			<RealPriceContiner>
				<TabMarket>
					<Ul>
						<TabMarketLi>
							<button onClick={() => onChangeMainCategory('krw')}>원화마켓</button>
						</TabMarketLi>
						<TabMarketLi>
							<button onClick={() => onChangeMainCategory('favorite')}>즐겨찾기</button>
						</TabMarketLi>
					</Ul>
				</TabMarket>
				<RealPriceTable>
					<colgroup>
						<col width="1%" />
						<col width="3%" />
						<col width="3%" />
						<col width="3%" />
					</colgroup>
					<thead>
						<tr>
							<th>자산</th>
							<th>실시간 시세</th>
							<th>변동율</th>
							<th>거래금액(24h)</th>
						</tr>
					</thead>
					<tbody>
						{mainCategory === 'krw'
							? tickersArr.slice(0, nextId.current).map(info => (
									<tr key={info.name}>
										<td>
											<button onClick={() => addFavorite(info.name)}>
												{favoriteCoins.includes(info.name) ? '🧡' : '🤍'}
											</button>
											{info.name}
										</td>
										<td>{info.closing_price}</td>
										<td>{info.fluctate_rate_24H}</td>
										<td>{info.fluctate_24H}</td>
									</tr>
							  ))
							: tickersArr
									.filter(info => favoriteCoins.includes(info.name))
									.map(info => (
										<tr key={info.name}>
											<td>
												<button onClick={() => addFavorite(info.name)}>
													{favoriteCoins.includes(info.name) ? '🧡' : '🤍'}
												</button>
												{info.name}
											</td>
											<td>{info.closing_price}</td>
											<td>{info.fluctate_rate_24H}</td>
											<td>{info.fluctate_24H}</td>
										</tr>
									))}
					</tbody>
				</RealPriceTable>
				{onStopShowMore() ? <TargetElem ref={setTarget}>{isLoading && '🚗💨💨💨'}</TargetElem> : ''}
			</RealPriceContiner>
		</Container>
	);
}

export default Home;

const TargetElem = styled.div`
	height: 150px;
`;

const Container = styled.div``;

const RealPriceContiner = styled.div``;

const TabMarket = styled.div`
	height: 5vh;
	display: block;
`;

const Ul = styled.div`
	list-style: none;
`;

const TabMarketLi = styled.li`
	margin: 0 0 0 0;
	padding: 0 0 0 0;
	border: 0;
	float: left;
`;

const RealPriceTable = styled.table`
	th,
	td {
		text-align: right;
		&:first-child {
			text-align: left;
		}
	}
`;
