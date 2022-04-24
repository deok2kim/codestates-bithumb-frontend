import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { fetchCoinHistory } from '../api';
import Chart from 'react-apexcharts';
import styled from 'styled-components';

function CoinChart({ orderCurrency, paymentCurrency, chartIntervals }) {
	const params = useParams();
	console.log('chart', params);
	const { isLoading, data } = useQuery(
		['history', orderCurrency],
		() => fetchCoinHistory(orderCurrency, paymentCurrency, chartIntervals),
		{
			refetchInterval: 50000,
		},
	);
	console.log(data);
	return (
		<Container>
			{isLoading ? (
				'Loading...'
			) : (
				<Chart
					type="area"
					series={[
						{
							name: 'Price',
							data: data.data?.slice(-200).map(price => price[2]),
						},
					]}
					options={{
						colors: ['#a19696'],
						fill: {
							type: 'solid',
							colors: ['#eee'],
						},
						chart: {
							toolbar: {
								show: false,
							},
							zoom: {
								enabled: false,
							},
							width: '50%',
							background: 'transparent',
						},
						grid: { show: false },
						theme: {
							mode: 'dark',
						},
						stroke: {
							// curve: 'smooth',
							width: 1,
						},
						dataLabels: {
							enabled: false,
						},
						yaxis: {
							show: false,
						},
						xaxis: {
							labels: {
								show: false,
							},
							axisTicks: {
								show: false,
							},
							axisBorder: {
								show: false,
							},
							// type: 'datetime',
							// categories: data.data?.map(price => price[0]),
						},
						tooltip: {
							// y: {
							// 	formatter: value => `$${value.toFixed(2)}`,
							// },
							enabled: false,
						},
					}}
				/>
			)}
		</Container>
	);
}

export default CoinChart;

const Container = styled.div`
	position: absolute;
	bottom: 30px;
	left: -10px;
`;
