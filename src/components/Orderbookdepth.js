import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
	width: 250px;
	height: 750px;
	tr {
		margin: 1rem 0;
		padding: 1rem 0;
		td:first-child {
			text-align: start;
			color: #f75467;
		}
	}

	th {
		/* color: gray; */
		text-align: center;
		padding: 10px;
		border-top: 1px solid #eee;
		font-weight: bold;
	}

	td {
		padding: 5px 10px;
		/* height: 19px; */
		/* line-height: 19px; */
		font-weight: 400;
		/* vertical-align: top; */
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
const Orderbookdepth = ({ orderbookdepth, orderbookdepthAskList, orderbookdepthBidList }) => {
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
					.slice(-15)
					.map((orderbookdepthAsk, idx) =>
						orderbookdepthAsk[1] > 0 ? (
							<tr key={orderbookdepthAsk[0]} style={{ backgroundColor: '#eef6ff' }}>
								<td>
									{parseInt(orderbookdepthAsk[0]).toLocaleString('ko-KR', {
										maximumFractionDigits: 4,
									})}
								</td>
								<td>{parseFloat(orderbookdepthAsk[1]).toFixed(4)}</td>
							</tr>
						) : (
							''
						),
					)}
				{Object.entries(orderbookdepthBidList)
					.filter(o => o[1] > 0)
					.reverse()
					.slice(0, 15)
					.map((orderbookdepthBid, idx) =>
						orderbookdepthBid[1] > 0 ? (
							<tr key={orderbookdepthBid[0]} style={{ backgroundColor: '#fff0ef' }}>
								<td>
									{parseInt(orderbookdepthBid[0]).toLocaleString('ko-KR', {
										maximumFractionDigits: 4,
									})}
								</td>
								<td>{orderbookdepthBid[1].toFixed(4)}</td>
							</tr>
						) : (
							''
						),
					)}
			</tbody>
		</Table>
	);
};

export default Orderbookdepth;
