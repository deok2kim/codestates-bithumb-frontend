import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
	width: 250px;
	max-height: 750px;
	tr {
		margin: 1rem 0;
		padding: 1rem 0;
		td:first-child {
			text-align: end;
			color: #f75467;

			span + span {
				padding: 0 15px;
			}
		}
	}

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
const OrderBook = ({ orderbookdepth, orderbookdepthAskList, orderbookdepthBidList }) => {
	return (
		<Table>
			<thead>
				<tr>
					<th>가격 ({orderbookdepth.symbol.split('_')[1]})</th>
					<th>수량 ({orderbookdepth.symbol.split('_')[0]})</th>
				</tr>
			</thead>
			<tbody>
				{Object.entries(orderbookdepthAskList)
					.filter(o => o[1])
					.reverse()
					.slice(-12)
					.map((orderbookdepthAsk, idx) =>
						orderbookdepthAsk[1] > 0 ? (
							<tr key={orderbookdepthAsk[0]} style={{ backgroundColor: '#eef6ff' }}>
								<td>
									<span>
										{parseFloat(orderbookdepthAsk[0]).toLocaleString('ko-KR', {
											maximumFractionDigits: 4,
										})}
									</span>
									<span>-1.57%</span>
								</td>
								<td>
									{parseFloat(orderbookdepthAsk[1]).toLocaleString('ko-KR', {
										maximumFractionDigits: 4,
									})}
								</td>
							</tr>
						) : (
							''
						),
					)}
				{Object.entries(orderbookdepthBidList)
					.filter(o => o[1] > 0)
					.reverse()
					.slice(0, 12)
					.map((orderbookdepthBid, idx) =>
						orderbookdepthBid[1] > 0 ? (
							<tr key={orderbookdepthBid[0]} style={{ backgroundColor: '#fff0ef' }}>
								<td>
									<span>
										{parseFloat(orderbookdepthBid[0]).toLocaleString('ko-KR', {
											maximumFractionDigits: 4,
										})}
									</span>
									<span>-3.74%</span>
								</td>
								<td>
									{parseFloat(orderbookdepthBid[1]).toLocaleString('ko-KR', {
										maximumFractionDigits: 4,
									})}
								</td>
							</tr>
						) : (
							''
						),
					)}
			</tbody>
		</Table>
	);
};

export default OrderBook;
