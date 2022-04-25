import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import RealPriceTable from '../components/RealPriceTable';

function RealPrice({ tickers, mainCategory, onChangeMainCategory, addFavorite, favoriteCoins }) {
	// 한무 스크롤
	console.log('Realprice', tickers);
	const [target, setTarget] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const nextId = useRef(20);

	const [input, setInput] = useState('');
	const onChange = e => {
		setInput(e.target.value);
	};

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
				<InputWrapper>
					<Input placeholder="검색" onChange={onChange} value={input} />
				</InputWrapper>
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
				input={input}
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
	padding-top: 30px;
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

const InputWrapper = styled.span`
	position: absolute;
	top: 10;
	right: 0;
`;

const Input = styled.input`
	/* display: block; */
	/* width: 100%; */
	height: 40px;
	padding: 0 12px;
	/* border: 1px solid #eee; */
	border-radius: 4px;
	font-size: 14px;
	line-height: 21px;
	font-weight: 400;
	letter-spacing: 0;
	/* background-color: #f9f9f9; */
	outline: 0;
	/* color: #777; */
	border: 1px solid #e5e5e5;
	background-color: #fafafa;
	color: #1b1b1b;
`;
