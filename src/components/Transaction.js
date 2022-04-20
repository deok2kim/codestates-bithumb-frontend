import React from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div`
	margin-top: 30px;
	height: 250px;
	overflow: hidden;
`;

const Table = styled.table`
	width: 400px;

	tr {
		margin: 1rem 0;
		padding: 1rem 0;
	}

	th {
		color: gray;
		text-align: end;
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

const ColorText = styled.span`
	color: ${props => props.buySellGb};
`;

const Transaction = ({ transactions }) => {
	const { symbol } = transactions[0];
	const data = transactions.slice(-20).reverse();
	return (
		<Container>
			<Table>
				<caption>체결내역</caption>
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
		</Container>
	);
};

export default Transaction;
