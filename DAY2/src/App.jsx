import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register'
import Privateroute from './components/privateroute/PrivateRoute';
import Home from './pages/Home/Home'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Privateroute/>}>
         <Route index element={<Home/>}/>
      </Route>

      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App