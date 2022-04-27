import { useQuery } from 'react-query';
import styled from 'styled-components';
import { fetchCoins, fetchOrderBook, fetchTransactionHistory } from '../api';
import RealPrice from './RealPrice';
import TopFiveCoins from './TopFiveCoins';
import Loader from '../components/Loader';

function Home() {
	const { isLoading, data: coins } = useQuery(['allCoins'], () => fetchCoins('ALL', 'KRW'));
	// const orderCurrency = 'BTC';
	// const paymentCurrency = 'KRW';
	// const { isLoading: orderBookLoading, data: initialOrderBookData } = useQuery(
	// 	[orderCurrency, 'order book'],
	// 	() => fetchOrderBook(orderCurrency, paymentCurrency),
	// );
	// console.log('orderbook', orderBookLoading, initialOrderBookData);
	// const { isLoading: transactionHistoryLoading, data: initialTransactionHistoryData } = useQuery(
	// 	[orderCurrency, 'transaction history'],
	// 	() => fetchTransactionHistory(orderCurrency, paymentCurrency, 30),
	// );
	// console.log('transactionhistor', transactionHistoryLoading, initialTransactionHistoryData);

	if (isLoading) {
		return <Loader type="spin" color="#FE9601" />;
	}
	return (
		<Container>
			<TopFiveCoins coins={coins.data} />
			<RealPrice coins={coins.data} />
		</Container>
	);
}

export default Home;

const Container = styled.div`
	width: 1200px;
	margin: auto;
`;
