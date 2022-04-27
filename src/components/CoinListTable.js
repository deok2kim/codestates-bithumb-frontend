import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';
import { coinNames } from '../data/coinNameData';
import CoinItem from './CoinItem';

function RealPriceTable({
	mainCategory,
	coins,
	nextId,
	favoriteCoins,
	toggleFavorite,
	input,
	setTarget,
}) {
	const [myfavoriteCoins, setMyFavoriteCoins] = useState([]);
	const [displayCoins, setDisplayCoins] = useState([]);

	const getRatePrice = useCallback((price, rate) => {
		return parseFloat(price) * parseFloat(rate);
	}, []);

	const realRate = useCallback((op, cp) => {
		const res = parseFloat((((parseFloat(cp) - parseFloat(op)) / parseFloat(op)) * 100).toFixed(2));
		return res;
	}, []);

	const setCoins = useCallback(() => {
		setMyFavoriteCoins(
			favoriteCoins.map(coin => ({
				...coins[coin],
				symbol: coin,
				name: coinNames[coin].koreanName,
				rate: realRate(coins[coin].opening_price, coins[coin].closing_price),
				rating_price: (
					(coins[coin].closing_price *
						realRate(coins[coin].opening_price, coins[coin].closing_price)) /
					100
				).toLocaleString('ko-KR', {
					maximumFractionDigits: 4,
				}),
				closing_price: parseFloat(coins[coin].closing_price).toLocaleString('ko-KR', {
					maximumFractionDigits: 4,
				}),
				acc_trade_value_24H: parseInt(coins[coin].acc_trade_value_24H).toLocaleString('ko-KR', {
					maximumFractionDigits: 4,
				}),
			})),
		);
		setDisplayCoins(
			Object.keys(coins)
				.slice(0, -1)
				.map(coin => ({
					...coins[coin],
					symbol: coin,
					name: coinNames[coin].koreanName,
					rate: realRate(coins[coin].opening_price, coins[coin].closing_price).toFixed(2),
					rating_price: (
						(coins[coin].closing_price *
							realRate(coins[coin].opening_price, coins[coin].closing_price)) /
						100
					).toLocaleString('ko-KR', {
						maximumFractionDigits: 4,
					}),
					closing_price: parseFloat(coins[coin].closing_price).toLocaleString('ko-KR', {
						maximumFractionDigits: 4,
					}),
					acc_trade_value_24H: parseInt(coins[coin].acc_trade_value_24H).toLocaleString('ko-KR', {
						maximumFractionDigits: 4,
					}),
				})),
		);
	}, [realRate, coins, favoriteCoins]);

	useEffect(() => {
		setCoins();
	}, [coins, favoriteCoins, setCoins]);
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
					? displayCoins
							.slice(0, nextId.current)
							.map(coin =>
								coinNames[coin.symbol].findName.includes(input.toUpperCase()) ? (
									<CoinItem
										key={coin.symbol}
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
							coinNames[coin.symbol].findName.includes(input.toUpperCase()) ? (
								<CoinItem
									key={coin.symbol}
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
