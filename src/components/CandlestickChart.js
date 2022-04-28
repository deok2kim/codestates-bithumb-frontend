import React from 'react';
import { useQuery } from 'react-query';
import { fetchCoinHistory } from '../api';
import Chart from 'react-apexcharts';
import styled from 'styled-components';

function CandlestickChart({ orderCurrency, paymentCurrency, chartIntervals }) {
	const { isLoading, data } = useQuery(
		['history', `${orderCurrency}_${paymentCurrency}`],
		() => fetchCoinHistory(orderCurrency, paymentCurrency, chartIntervals),
		{
			refetchInterval: 10000,
		},
	);
	return (
		<Container>
			{isLoading ? (
				'Loading...'
			) : (
				<>
					<Chart
						height={320}
						width={750}
						type="candlestick"
						series={[
							{
								data: data.data?.slice(-100).map(p => [p[0], p[1], p[3], p[4], p[2]]),
							},
						]}
						options={{
							plotOptions: {
								candlestick: {
									colors: {
										upward: 'blue',
										downward: 'red',
									},
								},
							},
							title: {
								text: `${orderCurrency}/${paymentCurrency}`,
							},
							chart: {
								type: 'candlestick',
								height: 350,
								id: 'candles',
								toolbar: {
									autuSelected: 'pan',
									show: false,
								},
							},
							grid: {
								xaxis: {
									lines: {
										show: true,
									},
								},
							},
							xaxis: {
								type: 'datetime',
							},
							yaxis: {
								tooltip: {
									enabled: true,
								},
							},
							tooltip: {
								theme: 'dark',
							},
						}}
					/>
					<Chart
						height={120}
						width={750}
						type="bar"
						series={[
							{
								name: 'volume',
								data: data.data?.slice(-100).map(p => p[5]),
							},
						]}
						options={{
							chart: {
								type: 'bar',
								toolbar: {
									show: false,
								},
							},
							plotOptions: {
								bar: {
									// borderRadius: 10,
									dataLabels: {
										position: 'top', // top, center, bottom
									},
								},
							},
							dataLabels: {
								enabled: false,
							},
							xaxis: {
								categories: [''],
							},
							yaxis: {
								labels: {
									show: true,
									formatter: function (val) {
										return val.toLocaleString('ko-KR', { maximumFractionDigits: 4 });
									},
								},
							},
							tooltip: {
								enabled: false,
							},
						}}
					/>
				</>
			)}
		</Container>
	);
}

export default React.memo(CandlestickChart);

const Container = styled.div`
	/* position: absolute;
	bottom: 30px;
	left: -10px; */
	width: 100%;
`;
