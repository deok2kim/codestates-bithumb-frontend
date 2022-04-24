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
						width={800}
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
						width={800}
						type="bar"
						series={[
							{
								name: 'volume',
								data: data.data?.slice(-100).map(p => p[5]),
							},
						]}
						options={{
							chart: {
								height: 50,
								type: 'bar',
								brush: {
									enabled: true,
									target: 'candles',
								},
							},
							dataLabels: {
								enabled: false,
							},

							xaxis: {
								show: false,
							},
							yaxis: {
								axisBorder: {
									show: false,
								},
								axisTicks: {
									show: false,
								},
								labels: {
									show: true,
									formatter: function (val) {
										return val.toFixed(0);
									},
								},
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
