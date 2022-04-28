import React from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import PriceInfo from './PriceInfo';

import { Helmet } from 'react-helmet';
import ReactLoading from 'react-loading';
import { setComma } from '../components/utils';

function PriceInfoContainer({ initialData, orderCurrency, paymentCurrency, addedData }) {
	const [coinInfo, setCoinInfo] = useState(initialData);

	const formatData = useCallback(() => {
		const fd = {
			symbol: `${orderCurrency}_${paymentCurrency}`,
			chgRate: coinInfo.fluctate_rate_24H,
			highPrice: coinInfo.max_price,
			lowPrice: coinInfo.min_price,
			volumePower: '100',
			prevClosePrice: coinInfo.prev_closing_price,
			volume: coinInfo.units_traded_24H,
			value: coinInfo.acc_trade_value_24H,
			closePrice: coinInfo.closing_price,
		};
		setCoinInfo(fd);
	}, [orderCurrency, paymentCurrency, coinInfo]);

	useEffect(() => {
		setCoinInfo(addedData);
	}, [addedData]);

	useEffect(() => {
		formatData();
	}, []);
	if (!coinInfo.symbol) return '';
	return (
		<>
			<PriceInfo coinInfo={coinInfo} />
			<Helmet>
				<title>
					{setComma(parseFloat(coinInfo.closePrice), 4)} {coinInfo.symbol.replace('_', '/')}
				</title>
			</Helmet>
		</>
	);
}

export default React.memo(PriceInfoContainer);
