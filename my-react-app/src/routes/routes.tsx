import {
    Route,
    Outlet,
    Routes,
    Navigate,
    BrowserRouter,
  } from 'react-router-dom';


const AppRoutes = () => {
    return (
       <BrowserRouter>
       <Routes>
        <Route path="/" element={<><h1>Home</h1></>} />
        <Route path="/component1" element={ <><h1>Component1</h1></>} />
       </Routes>
       </BrowserRouter>
    )
}

export default AppRoutes;