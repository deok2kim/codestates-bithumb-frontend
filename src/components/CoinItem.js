import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { coinNames } from '../data/coinNameData';

function CoinItem({ coin, toggleFavorite, favoriteCoins, getRatePrice }) {
	return (
		<CoinWrapper key={coin.name}>
			<CoinTitle>
				<FavoriteButton onClick={() => toggleFavorite(coin.name)}>
					{favoriteCoins.includes(coin.name) ? '🧡' : '🤍'}
				</FavoriteButton>
				<Link to={`${coin.name}_KRW`}>
					<p>
						<strong>{coinNames[coin.name].koreanName}</strong>
						<SmallText>{coin.name}/KRW</SmallText>
					</p>
				</Link>
				<span />
			</CoinTitle>
			<RealTimePrice>
				<strong>
					{parseFloat(coin.closing_price).toLocaleString('ko-KR', {
						maximumFractionDigits: 4,
					})}{' '}
					원
				</strong>
			</RealTimePrice>
			<Rate>
				<div>
					<strong>
						{getRatePrice(coin.opening_price, coin.fluctate_rate_24H).toLocaleString('ko-KR', {
							maximumFractionDigits: 4,
						})}{' '}
						원
					</strong>
					<strong>
						(
						{parseFloat(coin.fluctate_rate_24H) > 0
							? `+${coin.fluctate_rate_24H}`
							: coin.fluctate_rate_24H}{' '}
						%)
					</strong>
				</div>
			</Rate>
			<Amount>
				≈{' '}
				{
					parseFloat(coin.acc_trade_value_24H)
						.toLocaleString('ko-KR', {
							maximumFractionDigits: 4,
						})
						.split('.')[0]
				}{' '}
				원
			</Amount>
		</CoinWrapper>
	);
}

export default React.memo(CoinItem);

const SmallText = styled.span`
	display: block;
	color: #a4a4a4;
	font-size: 12px;
	line-height: 18px;
`;

const CoinWrapper = styled.tr`
	display: table-row;
	/* cursor: pointer; */
	vertical-align: middle;
`;

const Td = styled.td`
	padding: 14px 15px 11px;
	font-size: 14px;
	line-height: 15px;
	vertical-align: middle;
	border-bottom: 1px solid #eee;
	text-align: right;
`;

const CoinTitle = styled(Td)`
	text-align: left;
	width: 200px;
	padding-left: 10px;
	padding-right: 0px;
	p {
		display: inline-block;
		margin-left: 8px;
		vertical-align: middle;
	}
	div {
		position: relative;
	}
	strong {
		display: inline-block;
		line-height: 20px;
		font-weight: 400;
	}
`;

const FavoriteButton = styled.button`
	margin: 0;
	padding: 0;
`;

const RealTimePrice = styled(Td)``;
const Rate = styled(Td)``;
const Amount = styled(Td)``;
