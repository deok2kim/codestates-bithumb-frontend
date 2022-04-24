import React from 'react';
import styled from 'styled-components';

function RealPriceTable({ mainCategory, tickers, nextId, favoriteCoins, addFavorite }) {
	const getRatePrice = (price, rate) => {
		return parseFloat(price) * parseFloat(rate);
	};
	return (
		<Container>
			<colgroup>
				<col width="1%" />
				<col width="2%" />
				<col width="2%" />
				<col width="2%" />
			</colgroup>
			<tbody>
				{mainCategory === 'krw'
					? tickers.slice(0, nextId.current).map(info => (
							<tr key={info.name}>
								<td>
									<button onClick={() => addFavorite(info.name)}>
										{favoriteCoins.includes(info.name) ? '🧡' : '🤍'}
									</button>
									<p>
										<a>
											<strong>비트코인</strong>
											<SmallText>{info.name}/KRW</SmallText>
										</a>
									</p>
									<span />
								</td>
								<td>
									<strong>{info.closing_price} 원</strong>
								</td>
								<td>
									<div>
										<strong>{getRatePrice(info.opening_price, info.fluctate_rate_24H)} 원</strong>
										<strong>({info.fluctate_rate_24H} %)</strong>
									</div>
								</td>
								<td>≈ {info.acc_trade_value_24H} 원</td>
							</tr>
					  ))
					: tickers
							.filter(info => favoriteCoins.includes(info.name))
							.map(info => (
								<tr key={info.name}>
									<td>
										<div>
											<button onClick={() => addFavorite(info.name)}>
												{favoriteCoins.includes(info.name) ? '🧡' : '🤍'}
											</button>
											{info.name}
										</div>
									</td>
									<td>{info.closing_price} 원</td>
									<td>{info.fluctate_rate_24H}</td>
									<td>≈ {info.fluctate_24H} 원</td>
								</tr>
							))}
			</tbody>
		</Container>
	);
}

const Container = styled.table`
	padding-top: 70px;
	td {
		text-align: right;
		&:first-child {
			text-align: left;
			padding-left: 10px;
			padding-right: 0px;
			p {
				display: inline-block;
				/* margin-left: 22px; */
				margin-left: 8px;
				vertical-align: middle;
			}
		}
		padding: 14px 15px 11px;
		font-size: 14px;
		line-height: 15px;
		vertical-align: middle;
		border-bottom: 1px solid #eee;

		div {
			position: relative;
		}

		strong {
			display: inline-block;
			line-height: 20px;
			font-weight: 400;
		}
	}
	tr {
		display: table-row;
		cursor: pointer;
		vertical-align: middle;
	}
	button {
		margin: 0;
		padding: 0;
	}
`;

const SmallText = styled.span`
	display: block;
	color: #a4a4a4;
	font-size: 12px;
	line-height: 18px;
`;
export default RealPriceTable;
