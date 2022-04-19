import React from 'react';
import styled from 'styled-components';

function TopFive() {
    const tmpDataList = [
        {
            name: '메탈',
            price: 3886,
            rate: 30.09,
        },
        {
            name: '이피니티토큰',
            price: 3886,
            rate: 30.09,
        },
        {
            name: '에이피엠코인',
            price: 3886,
            rate: 30.09,
        },
        {
            name: '벨로프로토콜',
            price: 3886,
            rate: 30.09,
        },
        {
            name: '위드',
            price: 3886,
            rate: 30.09,
        },
    ]
    return (
        <>
        <h1>
            마켓 변동률 TOP5
            <button>원화 마켓</button>
            <button>BTC 마켓</button>
        </h1>
        <TopFiveContainer>
            {tmpDataList.map(info => (
                <li key={info.name}>
                <b>{info.name}</b>
                <h2>{info.price}</h2>
                <p>{info.rate}</p>
                </li>
            ))}
        </TopFiveContainer>
        </>
        
    )
}

export default TopFive;

const TopFiveContainer = styled.ul`
    display: flex;
`