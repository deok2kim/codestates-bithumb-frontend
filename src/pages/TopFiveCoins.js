import React from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CoinChart from '../components/CoinChart';
import { coinNames } from '../data/coinNameData';
import { BsArrowUp, BsArrowDown, BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';
import { setComma } from '../components/utils';

function TopFiveCoins({ coins }) {
	const [topFiveCoins, setTopFiveCoins] = useState([]);

	const realRate = useCallback((op, cp) => {
		if (parseFloat(op) === 0) {
			return 0;
		}
		return ((parseFloat(cp) - parseFloat(op)) / parseFloat(op)) * 100;
	}, []);

	const sort = useCallback(() => {
		const topFiveCoinsKeys = Object.keys(coins).sort(function (a, b) {
			parseFloat();
			const rateA = realRate(coins[a].opening_price, coins[a].closing_price);
			const rateB = realRate(coins[b].opening_price, coins[b].closing_price);
			return rateB - rateA;
		});
		setTopFiveCoins(
			topFiveCoinsKeys.slice(0, 5).map(coin => ({
				...coins[coin],
				symbol: coin,
				rate: realRate(coins[coin].opening_price, coins[coin].closing_price).toFixed(2),
				name: coinNames[coin].koreanName,
				closing_price: setComma(parseFloat(coins[coin].closing_price), 4),
			})),
		);
	}, [coins, realRate]);
	useEffect(() => {
		sort(coins);
	}, [coins, sort]);

	const setRateArrow = useCallback(rate => {
		if (rate >= 3) {
			return (
				<span>
					<BsArrowUp color="#f75467" />+
				</span>
			);
		} else if (rate > 0) {
			return (
				<span>
					<BsFillCaretUpFill color="#f75467" />+
				</span>
			);
		} else if (rate === 0) {
			return '';
		} else if (rate > -3) {
			return (
				<span>
					<BsFillCaretDownFill color="#4386f9" />-
				</span>
			);
		} else {
			return (
				<span>
					<BsArrowDown color="#4386f9" />-
				</span>
			);
		}
	}, []);
	return (
		<TopFiveArea>
			<h2>마켓 변동률 TOP5</h2>
			{/* <button>원화 마켓</button> */}
			{/* <button>BTC 마켓</button> */}
			<TopFiveContentWrap>
				<TopFiveList>
					{topFiveCoins.map(coin => (
						<li key={coin.symbol}>
							<Link to={`trade_order/${coin.symbol}_KRW`}>
								<DataWrapper>
									<Name>{coin.name}</Name>
									<Price color={coin.rate}>{coin.closing_price}</Price>
									<Rate color={coin.rate}>
										{setRateArrow(coin.rate)}
										{coin.rate} %
									</Rate>
									<CoinChart
										orderCurrency={coin.symbol}
										paymentCurrency="KRW"
										chartIntervals="10m"
									/>
								</DataWrapper>
							</Link>
						</li>
					))}
				</TopFiveList>
			</TopFiveContentWrap>
		</TopFiveArea>
	);
}

// export default TopFive;
export default React.memo(TopFiveCoins);

const TopFiveArea = styled.div`
	padding: 36px 0 10px;
	text-align: center;
	padding-bottom: 70px;

	h2 {
		margin-right: 20px;
		font-size: 24px;
		line-height: 36px;
		font-weight: 500;
		color: #1b1b1b;
		display: inline-block;
		vertical-align: middle;
	}

	button {
		border-radius: 4px 0 0 4px;
		background-color: #444;
		color: #fff;
		border-color: #444;
		display: inline-block;
		padding: 0 15px;
		line-height: 28px;
		min-width: 60px;
		box-sizing: border-box;
		background-color: #eee;
		border: 1px solid #ddd;
		color: #777;
		font-size: 12px;
	}
`;

const TopFiveContentWrap = styled.div`
	padding-top: 24px;
`;

const TopFiveList = styled.ul`
	display: flex;
	text-align: left;
	gap: 12px;
	li {
		display: flex;
		height: 120px;
		flex: 0 0 20%;

		a {
			height: 150px;
		}
	}
`;

const DataWrapper = styled.div`
	position: relative;
	height: 200px;

	div {
		width: 95%;
		position: relative;
	}
`;
const Name = styled.p``;
const Price = styled.p`
	color: ${props => (props.color > 0 ? 'red' : 'blue')};
	font-size: 28px;
	line-height: 33px;
	font-weight: 500;
	letter-spacing: 0;
	margin: 5px 0 4px;
`;

const Rate = styled.p`
	color: ${props => (props.color > 0 ? 'red' : 'blue')};
	font-size: 16px;
	line-height: 17px;
	font-weight: 400;
	letter-spacing: 0;
	vertical-align: middle;
`;
