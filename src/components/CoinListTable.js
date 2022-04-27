import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';
import { coinNames } from '../data/coinNameData';
import CoinItem from './CoinItem';
import { NoCoins } from './Error';

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
	const [searchedCoins, setSearchedCoins] = useState([]);
	const [searchedFavoriteCoins, setSearchedFavoriteCoins] = useState([]);

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
					accSort: parseInt(coins[coin].acc_trade_value_24H),
				}))
				.sort((a, b) => b.accSort - a.accSort),
		);
	}, [realRate, coins, favoriteCoins]);

	useEffect(() => {
		setCoins();
	}, [coins, favoriteCoins, setCoins]);

	useEffect(() => {
		setSearchedCoins(
			displayCoins.filter(coin => coinNames[coin.symbol].findName.includes(input.toUpperCase())),
		);
		setSearchedFavoriteCoins(
			myfavoriteCoins.filter(coin => coinNames[coin.symbol].findName.includes(input.toUpperCase())),
		);
	}, [input]);
	console.log(displayCoins);
	return (
		<>
			<Container>
				<colgroup>
					<col width="4%" />
					<col width="2%" />
					<col width="4%" />
					<col width="4%" />
				</colgroup>
				<tbody>
					{mainCategory === 'krw' &&
						displayCoins
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
							)}

					{mainCategory === 'favorite' &&
						myfavoriteCoins.map(coin =>
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
			{mainCategory === 'krw' && searchedCoins.length === 0 && (
				<NoCoins msg="찾는 코인이 없습니다.😢" />
			)}
			{mainCategory === 'favorite' && myfavoriteCoins.length === 0 && (
				<NoCoins msg="즐겨찾는 코인이 없습니다.😢" />
			)}
			{mainCategory === 'favorite' &&
				myfavoriteCoins.length > 0 &&
				searchedFavoriteCoins.length === 0 && <NoCoins msg="찾는 코인이 없습니다.😢" />}
		</>
	);
}

const Container = styled.table`
	padding-top: 70px;
`;
export default RealPriceTable;
