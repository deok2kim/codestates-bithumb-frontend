import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { fetchCoins } from '../api';
import RealPrice from './RealPrice';
import TopFive from './TopFive';

function Home() {
	const { isLoading, data: tickers } = useQuery(['allCoins'], () => fetchCoins('ALL', 'KRW'));
	const [favoriteCoins, setFavoriteCoins] = useState([]);
	const [mainCategory, setMainCategory] = useState('');

	useEffect(() => {
		setFavoriteCoins(JSON.parse(localStorage.getItem('favorite')));
		setMainCategory(localStorage.getItem('mainCategory'));
	}, []);

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

	// 카테고리 (원화 or 즐찾)
	const onChangeMainCategory = category => {
		setMainCategory(category);
		localStorage.setItem('mainCategory', category);
	};

	if (isLoading) return 'Loading...';
	return (
		<Container>
			<TopFive tickers={tickers} />
			<RealPrice
				tickers={tickers}
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
