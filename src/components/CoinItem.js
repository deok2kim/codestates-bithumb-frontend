import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function CoinItem({ coin, toggleFavorite, favoriteCoins, getRatePrice }) {
	return (
		<CoinWrapper>
			<CoinTitle>
				<FavoriteButton onClick={() => toggleFavorite(coin.symbol)}>
					{favoriteCoins.includes(coin.symbol) ? '🧡' : '🤍'}
				</FavoriteButton>
				<Link to={`trade_order/${coin.symbol}_KRW`}>
					<p>
						<strong>{coin.name}</strong>
						<SmallText>{coin.symbol}/KRW</SmallText>
					</p>
				</Link>
				<span />
			</CoinTitle>
			<RealTimePrice>
				<strong>{coin.closing_price} 원ㅤ</strong>
			</RealTimePrice>
			<Rate color={coin.fluctate_rate_24H}>
				<div>
					<strong>{coin.fluctate_24H} 원</strong>
					<strong>
						({coin.fluctate_rate_24H > 0 ? `+${coin.fluctate_rate_24H}` : coin.fluctate_rate_24H} %)
					</strong>
				</div>
			</Rate>
			<Amount>≈ {coin.acc_trade_value_24H} 원</Amount>
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
const Rate = styled(Td)`
	color: ${props => (props.color > 0 ? 'red' : 'blue')};
`;
const Amount = styled(Td)``;
