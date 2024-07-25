import React from 'react'
import { Box } from '@mui/material'
import Navbar from '../navbar/Navbar'
import { Navigate, Outlet } from 'react-router-dom'

function Privateroute() {
    
  return (
    <Box>
        <Navbar/>
            {true ? <Outlet /> : <Navigate to="/login" />}
              </Box>
  )
}

export default Privateroute