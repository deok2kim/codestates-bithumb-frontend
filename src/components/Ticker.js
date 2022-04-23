import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	margin: 20px;
`;

const CurrentPrice = styled.span`
	font-size: 24px;
	color: ${prop => (prop.chgRate > 0 ? 'red' : 'blue')};
	margin: 8px;
`;

const ChgRate = styled.span`
	font-size: 16px;
	color: white;
	background-color: ${prop => (prop.chgRate > 0 ? 'red' : 'blue')};
	border-radius: 4px;
	padding: 1px;
`;

const Table = styled.table`
	width: 400px;
	margin: 0 auto;

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

	th + td {
		th {
			margin-left: 20px;
		}
	}
`;

const Ticker = ({ ticker, info24 }) => {
	const { symbol, chgRate, highPrice, lowPrice, volumePower, prevClosePrice, chgAmt } = ticker;
	const { volume, value } = info24;
	return (
		<Container>
			<CurrentPrice chgRate={chgRate}>{parseInt(prevClosePrice) + parseInt(chgAmt)}</CurrentPrice>
			<ChgRate chgRate={chgRate}>{parseFloat(chgRate).toFixed(2)}%</ChgRate>
			<Table>
				<tbody>
					<tr>
						<th>거래량(24h)</th>
						<td>
							{parseFloat(volume).toFixed(4)} {symbol.split('_')[0]}
						</td>
						<th>고가(당일)</th>
						<td>{parseInt(highPrice).toLocaleString('ko-KR', { maximumFractionDigits: 4 })}</td>
					</tr>
					<tr>
						<th>거래금액(24h)</th>
						<td>{(value / 100000000).toLocaleString('ko-KR', { maximumFractionDigits: 1 })} 억</td>
						<th>저가(당일)</th>
						<td>{parseInt(lowPrice).toLocaleString('ko-KR', { maximumFractionDigits: 4 })}</td>
					</tr>
					<tr>
						<th>체결강도</th>
						<td style={{ color: 'red' }}>{volumePower}%</td>
						<th>전일종가</th>
						<td>
							{parseInt(prevClosePrice).toLocaleString('ko-KR', { maximumFractionDigits: 4 })}
						</td>
					</tr>
				</tbody>
			</Table>
		</Container>
	);
};

export default Ticker;
