import React from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div`
	margin: 20px;
	div {
		overflow-y: scroll;
		height: 200px;
	}
	p {
		font-size: 18px;
		text-align: start;
		font-weight: bold;
		padding: 10px 0;
		border-bottom: 1px solid black;
	}
`;

const Table = styled.table`
	width: 400px;
	margin: 15px 0;

	tr {
		/* margin: 1rem 0;
		/* padding: 1rem 0; */
		/* padding: 10px 0; */

		/* vertical-align: middle; */
		td:first-child {
			text-align: start;
		}
		th:first-child {
			text-align: start;
		}
	}

	th {
		color: gray;
		text-align: end;
		border-bottom: 1px solid black;
		padding-bottom: 10px;
	}

	td {
		font-weight: bold;
		text-align: end;
		padding: 5px 0;
	}

	td + th {
		td {
			margin-right: 20px;
		}
	}
`;

const ColorText = styled.span`
	color: ${props => props.buySellGb};
`;

const Transaction = ({ transactions }) => {
	const { symbol } = transactions[0];
	const data = transactions.slice(-20).reverse();
	return (
		<Container>
			<p>체결내역</p>
			<Table>
				<colgroup>
					<col />
					<col />
					<col />
				</colgroup>
				<thead>
					<tr>
						<th>시간</th>
						<th>가격({symbol.split('_')[1]})</th>
						<th>수량({symbol.split('_')[0]})</th>
					</tr>
				</thead>
			</Table>
			<div>
				<Table>
					<tbody>
						{data.map((info, index) => (
							<tr key={index}>
								<td>{info.contDtm.split(' ')[1].split('.')[0]}</td>
								<td>
									{parseInt(info.contPrice).toLocaleString('ko-KR', { maximumFractionDigits: 4 })}
								</td>
								{}
								<td>
									<ColorText buySellGb={info.buySellGb === '1' ? 'blue' : 'red'}>
										{parseFloat(info.contQty).toFixed(4)} {symbol.split('_')[0]}
									</ColorText>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>
		</Container>
	);
};

export default Transaction;
