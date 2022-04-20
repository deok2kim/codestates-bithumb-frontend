import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import TopFive from './TopFive';

const objToArr = (tickers, setArr) => {
	setArr(Object.keys(tickers).map(name => ({ name, ...tickers[name] })));
};

function Home({ tickers }) {
	const [tickersArr, setTickersArr] = useState([]);
	const [topFiveList, setTopFiveList] = useState([]);
	const [favoriteCoins, setFavoriteCoins] = useState([]);

	console.log(tickers);

	const getSortTopFive = tickersArr => {
		const newTicker = [...tickersArr]
			.sort((a, b) => b.fluctate_rate_24H - a.fluctate_rate_24H)
			.splice(0, 5);
		console.log(newTicker);
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
		const favoriteSymbols = JSON.parse(localStorage.getItem('favorite') || '[]');
		const indexInFavoriteSymbols = favoriteSymbols.indexOf(symbol);
		if (indexInFavoriteSymbols >= 0) {
			favoriteSymbols.splice(indexInFavoriteSymbols, 1);
			localStorage.setItem('favorite', JSON.stringify(favoriteSymbols));
		} else {
			localStorage.setItem('favorite', JSON.stringify([symbol, ...favoriteSymbols]));
		}
		setFavoriteCoins(JSON.parse(localStorage.getItem('favorite')));
	};

	useEffect(() => {
		setFavoriteCoins(JSON.parse(localStorage.getItem('favorite')));
	}, []);
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
							<button>원화마켓</button>
						</TabMarketLi>
						<TabMarketLi>
							<button>즐겨찾기</button>
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
						<th>자산</th>
						<th>실시간 시세</th>
						<th>변동율</th>
						<th>거래금액(24h)</th>
					</thead>
					<tbody>
						{tickersArr.map(info => (
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
			</RealPriceContiner>
		</Container>
	);
}

export default Home;

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
