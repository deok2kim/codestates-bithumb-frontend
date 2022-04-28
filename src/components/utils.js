export function setComma(price, point) {
	return price.toLocaleString('ko-KR', {
		maximumFractionDigits: point,
	});
}
