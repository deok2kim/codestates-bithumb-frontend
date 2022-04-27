import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import ReactLoading from 'react-loading';
import CoinListTable from '../components/CoinListTable';

function CoinList({ coins }) {
	const [target, setTarget] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [favoriteCoins, setFavoriteCoins] = useState([]);
	const [mainCategory, setMainCategory] = useState('krw');
	const nextId = useRef(15);

	useEffect(() => {
		setFavoriteCoins(JSON.parse(localStorage.getItem('favorite')) || []);
	}, []);

	const [input, setInput] = useState('');
	const onChange = useCallback(e => {
		setInput(e.target.value);
	}, []);

	const showMoreItems = useCallback(async () => {
		setIsLoading(true);
		await new Promise(resolve => setTimeout(resolve, 2000));
		nextId.current += 10;
		setIsLoading(false);
	}, []);

	const onIntersect = useCallback(
		async ([entry], observer) => {
			if (entry.isIntersecting && !isLoading) {
				observer.unobserve(entry.target);
				await showMoreItems();
				observer.observe(entry.target);
			}
		},
		[isLoading, showMoreItems],
	);

	// 즐겨찾기
	// const LOCALSTORAGE_FAVORITE_KEY = 'favorite'
	const toggleFavorite = useCallback(symbol => {
		const favoriteCoinsInLocalStorage = JSON.parse(localStorage.getItem('favorite') || '[]');
		const indexOfFavoriteCoins = favoriteCoinsInLocalStorage.indexOf(symbol);
		if (indexOfFavoriteCoins >= 0) {
			favoriteCoinsInLocalStorage.splice(indexOfFavoriteCoins, 1);
			localStorage.setItem('favorite', JSON.stringify(favoriteCoinsInLocalStorage));
		} else {
			localStorage.setItem('favorite', JSON.stringify([symbol, ...favoriteCoinsInLocalStorage]));
		}
		setFavoriteCoins(JSON.parse(localStorage.getItem('favorite')));
	}, []);

	// 카테고리 (원화 or 즐찾)
	const onChangeMainCategory = useCallback(category => {
		setMainCategory(category);
		localStorage.setItem('mainCategory', category);
	}, []);

	useEffect(() => {
		let observer;
		if (target) {
			observer = new IntersectionObserver(onIntersect, {
				threshold: 0.4,
			});
			observer.observe(target);
		}
		return () => observer && observer.disconnect();
	}, [target, onIntersect]);

	const onStopShowMore = () => {
		return nextId.current < Object.keys(coins).length;
	};

	return (
		<RealPriceContiner>
			<TabMarket mainCategory={mainCategory}>
				<CategoryButton show={mainCategory === 'krw'} onClick={() => onChangeMainCategory('krw')}>
					원화마켓
				</CategoryButton>
				<CategoryButton
					show={mainCategory === 'favorite'}
					onClick={() => onChangeMainCategory('favorite')}
				>
					즐겨찾기
				</CategoryButton>
				<InputWrapper>
					<Input placeholder="검색" onChange={onChange} value={input} />
				</InputWrapper>
			</TabMarket>
			<table>
				<colgroup>
					<col width="4%" />
					<col width="2%" />
					<col width="4%" />
					<col width="4%" />
				</colgroup>
				<thead>
					<tr>
						<th>자산</th>
						<th>실시간 시세</th>
						<th>변동율ㅤ</th>
						<th>거래금액(24h)</th>
					</tr>
				</thead>
			</table>
			<CoinListTable
				mainCategory={mainCategory}
				coins={coins}
				nextId={nextId}
				favoriteCoins={favoriteCoins}
				toggleFavorite={toggleFavorite}
				input={input}
				setTarget={setTarget}
			/>
			{mainCategory === 'krw' && onStopShowMore() ? (
				<TargetElem ref={setTarget}>
					{isLoading && <ReactLoading type="bubbles" color="#FE9601" />}
				</TargetElem>
			) : (
				''
			)}
		</RealPriceContiner>
	);
}

export default CoinList;

const TargetElem = styled.div`
	display: flex;
	height: 150px;
	justify-content: center;
`;

const CategoryButton = styled.button`
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
	border-bottom: ${props => (props.show ? '3px solid black' : '')};
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
