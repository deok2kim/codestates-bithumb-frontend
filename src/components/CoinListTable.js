import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';
import { coinNames } from '../data/coinNameData';
import CoinItem from './CoinItem';
import { NoCoins } from './Error';
import { BsArrowUp, BsArrowDown, BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';
import { setComma } from './utils';
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
				rating_price: setComma(
					(coins[coin].closing_price *
						realRate(coins[coin].opening_price, coins[coin].closing_price)) /
						100,
					4,
				),
				closing_price: setComma(parseFloat(coins[coin].closing_price), 4),
				acc_trade_value_24H: setComma(parseInt(coins[coin].acc_trade_value_24H), 4),
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
					rating_price: setComma(
						(coins[coin].closing_price *
							realRate(coins[coin].opening_price, coins[coin].closing_price)) /
							100,
						4,
					),
					closing_price: setComma(parseFloat(coins[coin].closing_price), 4),
					acc_trade_value_24H: setComma(parseInt(coins[coin].acc_trade_value_24H), 4),
					accSort: parseInt(coins[coin].acc_trade_value_24H),
				}))
				.sort((a, b) => b.accSort - a.accSort),
		);
	}, [realRate, coins, favoriteCoins]);

	const setRateArrow = useCallback(rate => {
		if (rate >= 3) {
			return <BsArrowUp color="#f75467" />;
		} else if (rate > 0) {
			return <BsFillCaretUpFill color="#f75467" />;
		} else if (rate === 0) {
			return 'ㅤ';
		} else if (rate > -3) {
			return <BsFillCaretDownFill color="#4386f9" />;
		} else {
			return <BsArrowDown color="#4386f9" />;
		}
	}, []);

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
					<col width="150px" />
					<col width="350px" />
					<col width="350px" />
					<col width="350px" />
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
										setRateArrow={setRateArrow}
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
									setRateArrow={setRateArrow}
								/>
							) : (
								''
							),
						)}
				</tbody>
			</Container>
			{mainCategory === 'krw' && input && searchedCoins.length === 0 && (
				<NoCoins msg="찾는 코인이 없습니다.😢" />
			)}
			{mainCategory === 'favorite' && myfavoriteCoins.length === 0 && (
				<NoCoins msg="즐겨찾는 코인이 없습니다.😢" />
			)}
			{mainCategory === 'favorite' &&
				myfavoriteCoins.length > 0 &&
				input &&
				searchedFavoriteCoins.length === 0 && <NoCoins msg="찾는 코인이 없습니다.😢" />}
		</>
	);
}

const Container = styled.table`
	padding-top: 70px;
`;
export default RealPriceTable;
