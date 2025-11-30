import {
    Route,
    Outlet,
    Routes,
    Navigate,
    BrowserRouter,
  } from 'react-router-dom';

import Home from '../pages/Home'


const AppRoutes = () => {
    return (
       <BrowserRouter>
       <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/component1" element={ <><h1>Component1</h1></>} />
       </Routes>
       </BrowserRouter>
    )
}

export default AppRoutes;