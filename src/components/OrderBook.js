import React from 'react';
import styled from 'styled-components';
import { setComma } from './utils';

const Info = styled.tr`
	background-color: ${props => (props.ask ? '#eef6ff' : '#fff0ef')};
	margin: 1rem 0;
	padding: 1rem 0;
	span {
		width: 90px;
		max-width: 100px;
	}
	td:first-child {
		text-align: end;
		color: ${props => (props.rate > 0 ? '#f75467' : '#4387F9')};

		span + span {
			padding-left: 30px;
		}
	}
`;

const Table = styled.table`
	width: 250px;
	max-height: 750px;

	th {
		text-align: center;
		padding: 10px;
		border-top: 1px solid #eee;
		font-weight: bold;
	}

	td {
		padding: 5px 0;
		font-weight: 400;
		text-align: end;
	}

	tbody: {
		display: block;
		overflow: scroll;
	}

	td + th {
		td {
			margin-right: 20px;
		}
	}
`;
// TODO: 현재가 대비 퍼센트
// 마이너스일 떈 파란색으루
const OrderBook = ({
	orderbookdepth,
	orderbookdepthAskList,
	orderbookdepthBidList,
	closingPrice,
}) => {
	const getRate = (currentPrice, closingPrice) => {
		return ((currentPrice - closingPrice) / closingPrice) * 100;
	};
	return (
		<Table>
			<thead>
				<Info>
					<th>가격 ({orderbookdepth.symbol.split('_')[1]})</th>
					<th>수량 ({orderbookdepth.symbol.split('_')[0]})</th>
				</Info>
			</thead>
			<tbody>
				{Object.entries(orderbookdepthAskList)
					.filter(o => o[1])
					.sort((a, b) => b[0] - a[0])
					.slice(-12)
					.map((orderbookdepthAsk, idx) =>
						orderbookdepthAsk[1] > 0 ? (
							<Info
								key={orderbookdepthAsk[0]}
								rate={getRate(parseFloat(orderbookdepthAsk[0]), parseFloat(closingPrice))}
								ask={true}
							>
								<td>
									<span>{setComma(parseFloat(orderbookdepthAsk[0]), 4)}</span>
									<span>
										{getRate(parseFloat(orderbookdepthAsk[0]), parseFloat(closingPrice)).toFixed(2)}{' '}
										%
									</span>
								</td>
								<td>{parseFloat(setComma(parseFloat(orderbookdepthAsk[1]), 4)).toFixed(4)}</td>
							</Info>
						) : (
							''
						),
					)}
				{Object.entries(orderbookdepthBidList)
					.filter(o => o[1] > 0)
					.sort((a, b) => b[0] - a[0])
					.slice(0, 12)
					.map((orderbookdepthBid, idx) =>
						orderbookdepthBid[1] > 0 ? (
							<Info
								key={orderbookdepthBid[0]}
								rate={getRate(parseFloat(orderbookdepthBid[0]), parseFloat(closingPrice))}
								ask={false}
							>
								<td>
									<span>{setComma(parseFloat(orderbookdepthBid[0]), 4)}</span>
									<span>
										{getRate(parseFloat(orderbookdepthBid[0]), parseFloat(closingPrice)).toFixed(2)}
										%
									</span>
								</td>
								<td>{parseFloat(setComma(parseFloat(orderbookdepthBid[1]), 4)).toFixed(4)}</td>
							</Info>
						) : (
							''
						),
					)}
			</tbody>
		</Table>
	);
};

export default OrderBook;
