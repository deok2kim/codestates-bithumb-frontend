import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import TopFive from './TopFive';

const objToArr = (tickers, setArr) => {
	setArr(Object.keys(tickers).map(name => ({name, ...tickers[name]})));
}

function Home({ tickers }) {
	const [tickersArr, setTickersArr] = useState([]);
	const [topFiveList, setTopFiveList] = useState([]);
	console.log(tickers)


	
	const getSortTopFive = (tickersArr) => {
		const newTicker = [...tickersArr].sort((a,b) => b.fluctate_rate_24H - a.fluctate_rate_24H).splice(0, 5)
		console.log(newTicker)
		setTopFiveList(newTicker)
		return newTicker
	}
	useEffect(() => {
		getSortTopFive(tickersArr)
	}, [tickersArr])

	useEffect(() => {
		objToArr(tickers, setTickersArr)
	}, [tickers])
	return (
		<Container>
			<p onClick={objToArr}>메인페이지입니다.</p>
				{/* <TopFive tickersArr={tickersArr}/> */}
				<ul>
					{topFiveList.map(info => (
						<li key={info.name}>{info.name}: {info.fluctate_rate_24H}</li>
					))}
				</ul>
				<hr />
				<ul>
					{tickersArr.map(info => (
						<li key={info.name}>{info.name}: {info.fluctate_rate_24H}</li>
					))}
				</ul>
		</Container>
	)
}

export default Home;

const Container = styled.div`

`