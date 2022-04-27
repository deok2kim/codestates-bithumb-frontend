import React from 'react';
import styled from 'styled-components';
import ReactLoading from 'react-loading';

function Loader({ type, color }) {
	return (
		<LoaderWrapper>
			<ReactLoading type={type} color={color} />
		</LoaderWrapper>
	);
}
export default Loader;
const LoaderWrapper = styled.div`
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	background-color: #eee;
	display: felx;
	align-items: center;
	justify-content: center;
`;
