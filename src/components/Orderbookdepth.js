import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
	tr {
		margin: 1rem 0;
		padding: 1rem 0;
	}

	th {
		color: gray;
		text-align: start;
	}

	td {
		font-weight: bold;
		text-align: end;
	}

	td + th {
		td {
			margin-right: 20px;
		}
	}
`;

const Orderbookdepth = ({ orderbookdepth, orderbookdepthAskList, orderbookdepthBidList }) => {
	return (
		<Table>
			<thead>
				<tr>
					<td>가격 ({orderbookdepth.symbol.split('_')[1]})</td>
					<td>수량 ({orderbookdepth.symbol.split('_')[0]})</td>
				</tr>
			</thead>
			<tbody>
				{Object.entries(orderbookdepthAskList)
					.filter(o => o[1])
					.reverse()
					.slice(-15)
					.map((orderbookdepthAsk, idx) =>
						orderbookdepthAsk[1] > 0 ? (
							<tr key={orderbookdepthAsk[0]} style={{ backgroundColor: 'skyblue' }}>
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
							<tr key={orderbookdepthBid[0]} style={{ backgroundColor: 'pink' }}>
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
