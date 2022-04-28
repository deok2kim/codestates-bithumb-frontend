import React from 'react';
import styled from 'styled-components';
import { setComma } from './utils';

const Container = styled.div`
	margin: 20px;
	div {
		display: flex;
		align-items: center;
		padding: 10px 0px;
	}
`;

const CurrentPrice = styled.span`
	font-size: 28px;
	color: ${prop => (prop.chgRate > 0 ? 'red' : 'blue')};
	margin-right: 10px;
	font-weight: bold;
`;

const ChgRate = styled.span`
	font-size: 16px;
	color: white;
	background-color: ${prop => (prop.chgRate > 0 ? 'red' : 'blue')};
	border-radius: 4px;
	padding: 3px;
`;

const Table = styled.table`
	width: 400px;
	margin: 0 auto;

	tr {
		line-height: 20px;
		td + th {
			padding-left: 10px
		}
	}

	th {
		color: gray;
		text-align: start;
		font-weight: bold;
		
		font-weight: 500;
		vertical-align: top;
		
	}

	td {
		font-weight: bold;
		text-align: end;
		font-weight: 500;
		vertical-align: top;
		& + th {
			margin-left: 30px;
		}
	}
}`;

const PriceInfo = ({ coinInfo }) => {
	const {
		symbol,
		chgRate,
		highPrice,
		lowPrice,
		volumePower,
		prevClosePrice,
		volume,
		value,
		closePrice,
	} = coinInfo;
	return (
		<Container>
			<div>
				<CurrentPrice chgRate={chgRate}>{setComma(parseInt(closePrice), 4)}</CurrentPrice>
				<ChgRate chgRate={chgRate}>{parseFloat(chgRate).toFixed(2)}%</ChgRate>
			</div>
			<Table>
				<tbody>
					<tr>
						<th>거래량(24h)</th>
						<td>
							{setComma(parseFloat(volume), 0)} {symbol.split('_')[0]}
						</td>
						<th>고가(당일)</th>
						<td>{setComma(parseInt(highPrice), 4)}</td>
					</tr>
					<tr>
						<th>거래금액(24h)</th>
						<td>{setComma(value / 100000000, 1)} 억</td>

						<th>저가(당일)</th>
						<td>{setComma(parseInt(lowPrice), 4)}</td>
					</tr>
					<tr>
						<th>체결강도</th>
						<td style={{ color: 'red' }}>{volumePower}%</td>

						<th>전일종가</th>
						<td>{setComma(parseInt(prevClosePrice), 4)}</td>
					</tr>
				</tbody>
			</Table>
		</Container>
	);
};

export default PriceInfo;
