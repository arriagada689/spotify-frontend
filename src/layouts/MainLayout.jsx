import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'

const MainLayout = () => {
    return (
        <>
            <SideBar />
            <Navbar />
            <Outlet />
        </>
    )
}

export default MainLayout