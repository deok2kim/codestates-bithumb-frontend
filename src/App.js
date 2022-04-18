import React from 'react';


// 라우터
import { BrowserRouter, Routes, Route } from 'react-router-dom' ;
import Home from './pages/Home';
import TradeOrder from './pages/TradeOrder';
import NotFound from './components/NotFound';


function App() {
  const URL_NAME = 'codestates-bithumb-frontend'
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={`${URL_NAME}/`} element={<Home />}>홈</Route>
          <Route path={`${URL_NAME}/trade_order/`} element={<TradeOrder />}>어웨이</Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
      {/* <TradeOrder /> */}
    </>
  )
}

export default App;