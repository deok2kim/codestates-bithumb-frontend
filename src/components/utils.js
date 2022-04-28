export function setComma(price, point) {
	return price.toLocaleString('ko-KR', {
		maximumFractionDigits: point,
	});
}

export function formatMillion(price) {
	return Math.round(price / 10 ** 7);
}

export function formatBillon(price) {}
