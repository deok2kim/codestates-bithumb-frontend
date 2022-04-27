const BASE_URL = 'https://api.bithumb.com/public';

export function fetchCoinHistory(orderCurrency, paymentCurrency, chartIntervals) {
	return fetch(
		`${BASE_URL}/candlestick/${orderCurrency}_${paymentCurrency}/${chartIntervals}`,
	).then(res => res.json());
}

export function fetchCoins(orderCurrency, paymentCurrency) {
	return fetch(`${BASE_URL}/ticker/${orderCurrency}_${paymentCurrency}`).then(res => res.json());
}
