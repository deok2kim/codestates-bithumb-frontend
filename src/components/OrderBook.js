import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { setComma } from './utils';
import ReactLoading from 'react-loading';

const Info = styled.tr`
	background-color: ${props => (props.ask ? '#eef6ff' : '#fff0ef')};
	margin: 1rem 0;
	padding: 1rem 0;
	td:first-child {
		text-align: end;
		color: ${props => (props.rate > 0 ? '#f75467' : '#4387F9')};
	}
`;
const Rate = styled.td`
	color: ${props => (props.rate > 0 ? '#f75467' : '#4387F9')};
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
`;
const TableHeader = styled.thead``;
const TableBody = styled.tbody`
	td {
		text-align: end;
	}
`;

const Amount = styled.td`
	background-color: inherit;
	position: relative;
	span {
		z-index: 1;
	}
`;

const Gage = styled.span`
	display: block;
	width: ${props => `${props.width}%`};
	background-color: ${props => props.color};
	text-align: end;
	position: absolute;
	left: 0;
	bottom: 0;
	z-index: 0;
	opacity: 0.5;
`;

const LoaderWrapper = styled.div`
	width: 270px;
	display: flex;
	justify-content: center;
`;

const OrderBook = ({
	orderbookdepth,
	orderbookdepthAskList,
	orderbookdepthBidList,
	closingPrice,
}) => {
	const [maxAmt, setMaxAmt] = useState(1);
	const getRate = (currentPrice, closingPrice) => {
		return ((currentPrice - closingPrice) / closingPrice) * 100;
	};
	useEffect(() => {
		setMaxAmt(prev =>
			Math.max(
				...Object.values(orderbookdepthAskList)
					.filter(d => d > 0)
					.sort((a, b) => b - a)
					.slice(-12),
				...Object.values(orderbookdepthBidList)
					.filter(d => d > 0)
					.sort((a, b) => b - a)
					.slice(0, 12),
			),
		);
	}, [orderbookdepthAskList, orderbookdepthBidList]);
	if (Object.keys({ ...orderbookdepthAskList, ...orderbookdepthBidList }).length < 20) {
		return (
			<LoaderWrapper>
				<ReactLoading type="spin" color="red" />
			</LoaderWrapper>
		);
	}
	return (
		<Table>
			<colgroup>
				<col width="30%" />
				<col width="30%" />
				<col width="40%" />
			</colgroup>
			<TableHeader>
				<Info>
					<th colSpan={2}>가격 ({orderbookdepth.symbol.split('_')[1]})</th>
					<th>수량 ({orderbookdepth.symbol.split('_')[0]})</th>
				</Info>
			</TableHeader>
			<TableBody>
				{Object.entries(orderbookdepthAskList)
					.filter(o => o[1] > 0)
					.sort((a, b) => b[0] - a[0])
					.slice(-12)
					.map((orderbookdepthAsk, idx) =>
						orderbookdepthAsk[1] > 0 ? (
							<Info
								key={orderbookdepthAsk[0]}
								rate={getRate(parseFloat(orderbookdepthAsk[0]), parseFloat(closingPrice))}
								ask={true}
							>
								<td>{setComma(parseFloat(orderbookdepthAsk[0]), 4)}</td>
								<Rate rate={getRate(parseFloat(orderbookdepthAsk[0]), parseFloat(closingPrice))}>
									{getRate(parseFloat(orderbookdepthAsk[0]), parseFloat(closingPrice)).toFixed(2)} %
								</Rate>
								<Amount>
									{parseFloat(setComma(parseFloat(orderbookdepthAsk[1]), 4)).toFixed(4)}
									<Gage width={(orderbookdepthAsk[1] / maxAmt) * 100} color="#8fb3eb">
										&nbsp;
									</Gage>
								</Amount>
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
								<td>{setComma(parseFloat(orderbookdepthBid[0]), 4)}</td>
								<Rate rate={getRate(parseFloat(orderbookdepthBid[0]), parseFloat(closingPrice))}>
									{getRate(parseFloat(orderbookdepthBid[0]), parseFloat(closingPrice)).toFixed(2)} %
								</Rate>
								<Amount>
									{parseFloat(setComma(parseFloat(orderbookdepthBid[1]), 4)).toFixed(4)}
									<Gage width={(orderbookdepthBid[1] / maxAmt) * 100} color="#efa3ac">
										&nbsp;
									</Gage>
								</Amount>
							</Info>
						) : (
							''
						),
					)}
			</TableBody>
		</Table>
	);
};

export default OrderBook;
