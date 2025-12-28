import {
    Route,
    Outlet,
    Routes,
    Navigate,
    BrowserRouter,
  } from 'react-router-dom';

import Home from '../pages/Home'
import TeamChat from '../components/Chat/TeamChat'


const AppRoutes = () => {
    return (
       <BrowserRouter>
       <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/component1" element={ <><h1>Component1</h1></>} />
        <Route path="/team-chat" element={ <TeamChat/> } />
       </Routes>
       </BrowserRouter>
    )
}

export default AppRoutes;