import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import RealPriceTable from '../components/RealPriceTable';

function RealPrice({ tickers, mainCategory, onChangeMainCategory, addFavorite, favoriteCoins }) {
	// 한무 스크롤
	console.log('Realprice', tickers);
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
				<button onClick={() => onChangeMainCategory('krw')}>원화마켓</button>
				<button onClick={() => onChangeMainCategory('favorite')}>즐겨찾기</button>
			</TabMarket>
			<table>
				<colgroup>
					<col width="1%" />
					<col width="4%" />
					<col width="4%" />
					<col width="4%" />
				</colgroup>
				<thead>
					<tr>
						<th>자산</th>
						<th>실시간 시세</th>
						<th>변동율</th>
						<th>거래금액(24h)</th>
					</tr>
				</thead>
			</table>
			<RealPriceTable
				mainCategory={mainCategory}
				tickers={tickers}
				nextId={nextId}
				favoriteCoins={favoriteCoins}
				addFavorite={addFavorite}
			/>
			{onStopShowMore() ? <TargetElem ref={setTarget}>{isLoading && '🚗💨💨💨'}</TargetElem> : ''}
		</RealPriceContiner>
	);
}

export default RealPrice;

const TargetElem = styled.div`
	height: 100px;
`;

const RealPriceContiner = styled.div`
	table {
		th {
			text-align: right;
			&:first-child {
				text-align: left;
				padding-left: 35px;
				padding-right: 0px;
				p {
					display: inline-block;
					margin-left: 8px;
					vertical-align: middle;
				}
			}
			padding: 14px 15px 11px;
			font-size: 14px;
			line-height: 15px;
			vertical-align: middle;
			border-bottom: 1px solid #eee;
			background-color: #f9f9f9;
			position: relative;
			min-height: 20px;
			line-height: 19px;
			padding-right: 15px;
			vertical-align: middle;
			cursor: pointer;
		}
		tr {
			display: table-row;
			cursor: pointer;
			vertical-align: middle;
		}
	}
`;

const TabMarket = styled.div`
	/* height: 5vh; */
	/* display: block; */
	position: relative;
	border-bottom: 1px solid #eee;

	&:first-child {
		margin-left: 0;
	}
	button {
		/* font-weight: 500; */
		/* color: #1b1b1b; */
		position: relative;
		display: inline-block;
		margin-right: 16px;
		font-size: 20px;
		line-height: 30px;
		font-weight: 400;
		padding: 12px 20px;
		color: #777;
		text-align: center;
		cursor: pointer;
		min-width: 70px;
		box-sizing: border-box;
	}
`;
