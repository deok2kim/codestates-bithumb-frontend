import React from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Transaction from './Transaction';

function TransactionContainer({ initialData, orderCurrency, paymentCurrency, addedData }) {
	const [transactions, setTransactions] = useState(initialData);

	const formatData = useCallback(() => {
		const fd = transactions.map((t, i) => ({
			symbol: `${orderCurrency}_${paymentCurrency}`,
			buySellGb: t.type === 'bid' ? '2' : '1',
			contPrice: t.price,
			contQty: t.units_traded,
			contAmt: t.total,
			contDtm: `${t.transaction_date} ${i}`,
			unpd: null,
		}));
		setTransactions(fd);
	}, [orderCurrency, paymentCurrency, transactions]);

	useEffect(() => {
		setTransactions(prev => [...prev, ...addedData].slice(-20));
	}, [addedData]);

	useEffect(() => {
		formatData();
	}, []);
	if (!transactions[0].symbol) return 'loading';
	return <Transaction transactions={transactions} />;
	// return <></>;
}

export default React.memo(TransactionContainer);
