import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { fetchCoins } from '../api';
import Loader from './Loader';
import { coinNames } from '../data/coinNameData';
import { setComma, formatMillion } from './utils';
import { AiFillStar } from 'react-icons/ai';
import { Link } from 'react-router-dom';

function TRCoinList() {
	const { isLoading, data: coins } = useQuery(['allCoins'], () => fetchCoins('ALL', 'KRW'));
	if (isLoading) {
		return <Loader type="spin" color="#FE9601" />;
	}
	return (
		<Table>
			<colgroup>
				<col width="39%" />
				<col width="20%" />
				<col width="20%" />
				<col width="21%" />
			</colgroup>
			<thead>
				<tr>
					<th>자산</th>
					<th>현재가</th>
					<th>변동률</th>
					<th>거래금액</th>
				</tr>
			</thead>
			<tbody>
				{Object.keys(coins.data)
					.slice(0, 90)
					.map(
						coin =>
							coin !== 'date' && (
								<Coin key={coin}>
									<td>
										<button>
											<AiFillStar color="#d6d6d6" />
										</button>
										<Link to={`/codestates-bithumb-frontend/trade_order/${coin}_KRW`}>
											{coinNames[coin].koreanName}
											<SmallText>{coin}/KRW</SmallText>
										</Link>
									</td>
									<Price rate={parseFloat(coins.data[coin].fluctate_rate_24H)}>
										{setComma(parseFloat(coins.data[coin].closing_price), 4)} 원
									</Price>
									<Rate rate={parseFloat(coins.data[coin].fluctate_rate_24H)}>
										<span>
											<p>{parseFloat(coins.data[coin].fluctate_rate_24H).toFixed(2)} %</p>{' '}
											{setComma(parseFloat(coins.data[coin].fluctate_24H), 4)}
										</span>
									</Rate>
									<td>
										{setComma(formatMillion(parseInt(coins.data[coin].acc_trade_value_24H), 0))}{' '}
										백만
									</td>
								</Coin>
							),
					)}
			</tbody>
		</Table>
	);
}

const Table = styled.table`
	th {
		color: #a4a4a4;
		letter-spacing: -0.07em;
		line-height: 20px;
	}
`;

const Coin = styled.tr`
	padding: 8px 0;
	border-bottom: 1px solid #eee;
	vertical-align: middle;

	td {
		padding: 10px 0;
		text-align: end;
	}

	td:first-child {
		text-align: start;
	}
	span {
		display: block;
	}
`;

const Price = styled.td`
	color: ${props => (props.rate > 0 ? 'red' : 'blue')};
`;
const Rate = styled(Price)``;

const SmallText = styled.span`
	display: block;
	color: #a4a4a4;
	/* font-size: 12px;
	line-height: 18px; */
`;
export default React.memo(TRCoinList);
