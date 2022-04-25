import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { fetchCoins } from '../api';
import RealPrice from './RealPrice';
import TopFive from './TopFive';

function Home() {
	console.log('홈');
	const { isLoading, data: tickers } = useQuery(['allCoins'], () => fetchCoins('ALL', 'KRW'));

	if (isLoading) return 'Loading...';
	return (
		<Container>
			<TopFive tickers={tickers} />
			<RealPrice tickers={tickers} />
		</Container>
	);
}

export default Home;

const Container = styled.div`
	width: 1200px;
	margin: auto;
`;
