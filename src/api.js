const BASE_URL = 'https://api.bithumb.com/public';

export function fetchCoinHistory(orderCurrency, paymentCurrency, chartIntervals) {
	return fetch(
		`${BASE_URL}/candlestick/${orderCurrency}_${paymentCurrency}/${chartIntervals}`,
	).then(res => res.json());
}
