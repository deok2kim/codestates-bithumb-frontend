const BASE_URL = 'https://api.bithumb.com/public';

export function fetchCoinHistory(orderCurrency, paymentCurrency, chartIntervals) {
	return fetch(
		`${BASE_URL}/candlestick/${orderCurrency}_${paymentCurrency}/${chartIntervals}`,
	).then(res => res.json());
}

export async function fetchCoins(orderCurrency, paymentCurrency) {
	const response = await fetch(`${BASE_URL}/ticker/${orderCurrency}_${paymentCurrency}`);
	const json = await response.json();
	console.log('최초데이터', json);
	delete json.data.date;
	return Object.keys(json.data).map(key => ({ name: key, ...json.data[key] }));
}
