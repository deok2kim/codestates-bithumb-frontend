import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import RealPrice from './RealPrice';
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
			.splice(0, 5)
			.map(function (data) {
				let rate = parseFloat(data.fluctate_24H);
				if (rate > 0) {
					return { ...data, color: '#f75467', icon: '🔺' };
				} else if (rate < 0) {
					return { ...data, color: '#4386f9', icon: '🔻' };
				} else {
					return { ...data, color: '#444', icon: '' };
				}
			});
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

	// // 한무 스크롤
	// const [target, setTarget] = useState(null);
	// const [isLoading, setIsLoading] = useState(false);
	// const nextId = useRef(10);

	// const showMoreItems = async () => {
	// 	setIsLoading(true);
	// 	await new Promise(resolve => setTimeout(resolve, 300));
	// 	nextId.current += 10;
	// 	setIsLoading(false);
	// };

	// const onIntersect = async ([entry], observer) => {
	// 	if (entry.isIntersecting && !isLoading) {
	// 		observer.unobserve(entry.target);
	// 		await showMoreItems();
	// 		observer.observe(entry.target);
	// 	}
	// };

	// useEffect(() => {
	// 	let observer;
	// 	if (target) {
	// 		observer = new IntersectionObserver(onIntersect, {
	// 			threshold: 0.4,
	// 		});
	// 		observer.observe(target);
	// 	}
	// 	return () => observer && observer.disconnect();
	// }, [target]);

	// const onStopShowMore = () => {
	// 	return nextId.current < tickersArr.length;
	// };

	return (
		<Container>
			<TopFive topFiveTickers={topFiveList} />
			<RealPrice
				tickers={tickersArr}
				mainCategory={mainCategory}
				onChangeMainCategory={onChangeMainCategory}
				addFavorite={addFavorite}
				favoriteCoins={favoriteCoins}
			/>
		</Container>
	);
}

export default Home;

const Container = styled.div`
	width: 1200px;
	margin: auto;
`;
