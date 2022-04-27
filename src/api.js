const BASE_URL = 'https://api.bithumb.com/public';

export function fetchCoinHistory(orderCurrency, paymentCurrency, chartIntervals) {
	return fetch(
		`${BASE_URL}/candlestick/${orderCurrency}_${paymentCurrency}/${chartIntervals}`,
	).then(res => res.json());
}

export function fetchCoins(orderCurrency, paymentCurrency) {
	return fetch(`${BASE_URL}/ticker/${orderCurrency}_${paymentCurrency}`).then(res => res.json());
}

export function fetchCoin(orderCurrency, paymentCurrency) {
	return fetch(`${BASE_URL}/ticker/${orderCurrency}_${paymentCurrency}`).then(res => res.json());
}

export function fetchOrderBook(orderCurrency, paymentCurrency) {
	// console.log(`${BASE_URL}/orderbook/${orderCurrency}_${paymentCurrency}?count=${count}`);
	return fetch(`${BASE_URL}/orderbook/${orderCurrency}_${paymentCurrency}`).then(res => res.json());
}

export function fetchTransactionHistory(orderCurrency, paymentCurrency, count) {
	return fetch(
		`${BASE_URL}/transaction_history/${orderCurrency}_${paymentCurrency}?count=${count}`,
	).then(res => res.json());
}
