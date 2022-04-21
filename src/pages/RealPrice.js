import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

function RealPrice({ tickers, mainCategory, onChangeMainCategory, addFavorite, favoriteCoins }) {
	// 한무 스크롤
	const [target, setTarget] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const nextId = useRef(20);

	const showMoreItems = async () => {
		setIsLoading(true);
		await new Promise(resolve => setTimeout(resolve, 300));
		nextId.current += 10;
		setIsLoading(false);
	};

	const onIntersect = async ([entry], observer) => {
		if (entry.isIntersecting && !isLoading) {
			observer.unobserve(entry.target);
			await showMoreItems();
			observer.observe(entry.target);
		}
	};

	useEffect(() => {
		let observer;
		if (target) {
			observer = new IntersectionObserver(onIntersect, {
				threshold: 0.4,
			});
			observer.observe(target);
		}
		return () => observer && observer.disconnect();
	}, [target]);

	const onStopShowMore = () => {
		return nextId.current < tickers.length;
	};

	return (
		<RealPriceContiner>
			<TabMarket>
				<Ul>
					<TabMarketLi>
						<button onClick={() => onChangeMainCategory('krw')}>원화마켓</button>
					</TabMarketLi>
					<TabMarketLi>
						<button onClick={() => onChangeMainCategory('favorite')}>즐겨찾기</button>
					</TabMarketLi>
				</Ul>
			</TabMarket>
			<RealPriceTable>
				<colgroup>
					<col width="1%" />
					<col width="3%" />
					<col width="3%" />
					<col width="3%" />
				</colgroup>
				<thead>
					<tr>
						<th>자산</th>
						<th>실시간 시세</th>
						<th>변동율</th>
						<th>거래금액(24h)</th>
					</tr>
				</thead>
				<tbody>
					{mainCategory === 'krw'
						? tickers.slice(0, nextId.current).map(info => (
								<tr key={info.name}>
									<td>
										<button onClick={() => addFavorite(info.name)}>
											{favoriteCoins.includes(info.name) ? '🧡' : '🤍'}
										</button>
										{info.name}
									</td>
									<td>{info.closing_price}</td>
									<td>{info.fluctate_rate_24H}</td>
									<td>{info.fluctate_24H}</td>
								</tr>
						  ))
						: tickers
								.filter(info => favoriteCoins.includes(info.name))
								.map(info => (
									<tr key={info.name}>
										<td>
											<button onClick={() => addFavorite(info.name)}>
												{favoriteCoins.includes(info.name) ? '🧡' : '🤍'}
											</button>
											{info.name}
										</td>
										<td>{info.closing_price}</td>
										<td>{info.fluctate_rate_24H}</td>
										<td>{info.fluctate_24H}</td>
									</tr>
								))}
				</tbody>
			</RealPriceTable>
			{onStopShowMore() ? <TargetElem ref={setTarget}>{isLoading && '🚗💨💨💨'}</TargetElem> : ''}
		</RealPriceContiner>
	);
}

export default RealPrice;

const TargetElem = styled.div`
	height: 100px;
`;

const RealPriceContiner = styled.div``;

const TabMarket = styled.div`
	height: 5vh;
	display: block;
`;

const Ul = styled.div`
	list-style: none;
`;

const TabMarketLi = styled.li`
	margin: 0 0 0 0;
	padding: 0 0 0 0;
	border: 0;
	float: left;
`;

const RealPriceTable = styled.table`
	th,
	td {
		text-align: right;
		&:first-child {
			text-align: left;
		}
	}
`;
