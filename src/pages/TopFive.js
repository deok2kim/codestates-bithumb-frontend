import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CoinChart from '../components/CoinChart';

function TopFive({ tickers }) {
	console.log('TOPFIVE');
	const [topFiveTickers, setTopFiveTickers] = useState([]);
	const getSortTopFive = tickers => {
		const newTicker = [...tickers]
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
		setTopFiveTickers(newTicker);
		return newTicker;
	};
	useEffect(() => {
		getSortTopFive(tickers);
		console.log('useEffect, sort');
	}, [tickers]);
	return (
		<TopFiveArea>
			<h2>마켓 변동률 TOP5</h2>
			<button>원화 마켓</button>
			<button>BTC 마켓</button>
			<TopFiveContentWrap>
				<TopFiveList>
					{topFiveTickers.map(info => (
						<li key={info.name}>
							<Link to={`${info.name}_KRW`}>
								<DataWrapper>
									<Name>{info.name}</Name>
									<Price color={info.color}>
										{parseFloat(info.closing_price).toLocaleString('ko-KR', {
											maximumFractionDigits: 4,
										})}
									</Price>
									<Rate color={info.color}>
										{info.icon}
										{info.fluctate_rate_24H} %
									</Rate>
									<CoinChart orderCurrency={info.name} paymentCurrency="KRW" chartIntervals="10m" />
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
export default React.memo(TopFive);

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
	color: ${props => props.color};
	font-size: 28px;
	line-height: 33px;
	font-weight: 500;
	letter-spacing: 0;
	margin: 5px 0 4px;
`;

const Rate = styled.p`
	color: ${props => props.color};
	font-size: 16px;
	line-height: 17px;
	font-weight: 400;
	letter-spacing: 0;
`;
