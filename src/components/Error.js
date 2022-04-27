import React from 'react';
import styled from 'styled-components';
const MessageWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1200px;
	height: 200px;
`;

export function NoCoins({ msg }) {
	return (
		<MessageWrapper>
			<p>{msg}</p>
		</MessageWrapper>
	);
}
