import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { coinNames } from '../data/coinNameData';
import CoinItem from './CoinItem';

function RealPriceTable({ mainCategory, tickers, nextId, favoriteCoins, toggleFavorite, input }) {
	const [myfavoriteCoins, setMyFavoriteCoins] = useState([]);
	console.log('ReaclPriceTable');
	const getRatePrice = useCallback((price, rate) => {
		return parseFloat(price) * parseFloat(rate);
	}, []);

	useEffect(() => {
		setMyFavoriteCoins(tickers.filter(coin => favoriteCoins.includes(coin.name)));
	}, [tickers, favoriteCoins]);

	return (
		<Container>
			<colgroup>
				<col width="4%" />
				<col width="2%" />
				<col width="4%" />
				<col width="4%" />
			</colgroup>
			<tbody>
				{mainCategory === 'krw'
					? tickers
							?.slice(0, nextId.current)
							.map(coin =>
								coinNames[coin.name].findName.includes(input.toUpperCase()) ? (
									<CoinItem
										key={coin.name}
										coin={coin}
										toggleFavorite={toggleFavorite}
										favoriteCoins={favoriteCoins}
										getRatePrice={getRatePrice}
									/>
								) : (
									''
								),
							)
					: myfavoriteCoins.map(coin =>
							coinNames[coin.name].findName.includes(input.toUpperCase()) ? (
								<CoinItem
									key={coin.name}
									coin={coin}
									toggleFavorite={toggleFavorite}
									favoriteCoins={favoriteCoins}
									getRatePrice={getRatePrice}
								/>
							) : (
								''
							),
					  )}
			</tbody>
		</Container>
	);
}

const Container = styled.table`
	padding-top: 70px;
`;
export default RealPriceTable;
