import { useQuery } from 'react-query';
import styled from 'styled-components';
import { fetchCoins } from '../api';
import RealPrice from './RealPrice';
import TopFiveCoins from './TopFiveCoins';
import Loader from '../components/Loader';

function Home() {
	const { isLoading, data: coins } = useQuery(['allCoins'], () => fetchCoins('ALL', 'KRW'));

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
