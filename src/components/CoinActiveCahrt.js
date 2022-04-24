import React from 'react';
import { useQuery } from 'react-query';
import { fetchCoinHistory } from '../api';
import Chart from 'react-apexcharts';
import styled from 'styled-components';

function CoinActiveChart({ orderCurrency, paymentCurrency, chartIntervals, width, height }) {
	const { isLoading, data } = useQuery(
		['history', orderCurrency],
		() => fetchCoinHistory(orderCurrency, paymentCurrency, chartIntervals),
		{
			refetchInterval: 10000,
		},
	);
	return (
		<Container>
			<Title>
				<p>차트</p>
			</Title>
			{isLoading ? (
				'Loading...'
			) : (
				<Chart
					width={width}
					height={height}
					type="area"
					series={[
						{
							name: 'Price',
							data: data.data?.slice(-150).map(price => price[2]),
						},
					]}
					options={{
						colors: ['#4387f9'],
						fill: {
							type: 'solid',
							colors: ['#cbdefd'],
						},
						labels: data.data?.slice(-150).map(price => price[0] + 9 * 60 * 60 * 1000), // 한국시간 때문에 9시간 더해줌
						chart: {
							toolbar: {
								show: false,
							},
							zoom: {
								enabled: false,
							},
							background: 'transparent',
						},
						grid: { show: false },
						stroke: {
							width: 1,
							curve: 'straight',
						},
						dataLabels: {
							enabled: false,
						},
						yaxis: {
							show: false,
						},
						xaxis: {
							type: 'datetime',
						},
						tooltip: {
							y: {
								formatter: value =>
									`$${value.toLocaleString('ko-KR', { maximumFractionDigits: 4 })}`,
							},
							x: {
								format: 'HH:mm',
							},
						},
					}}
				/>
			)}
		</Container>
	);
}

export default CoinActiveChart;

const Container = styled.div`
	display: flex;
	/* position: absolute; */
	bottom: 30px;
	left: -10px;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`;

const Title = styled.div`
	padding: 0 30px;
	width: 100%;
	text-align: start;
	font-size: 18px;
	p {
		border-bottom: 1px solid gray;
		padding-bottom: 10px;
		font-weight: bold;
	}
`;
