import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'

const MainLayout = () => {
    return (
        <div className='h-screen md:p-1'>
            <SideBar />
            
            <div className='md:ml-[379px] flex flex-col h-full'>
                <Navbar />
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout