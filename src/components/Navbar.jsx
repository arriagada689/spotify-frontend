import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import spotifyImage from '../assets/spotify_default2.jpg';

const Navbar = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const [isLoggedIn, setIsLoggedIn] = useState(userInfo ? true : false)
    const { logoutUser } = useContext(AuthContext)
    
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(userInfo ? true : false)
    }, [localStorage.getItem('userInfo')])

    const logoutHandler = (e) => {
        e.preventDefault()
        logoutUser()
        navigate('/')
    }

    return (
        <div className='bg-primary flex justify-between p-3 rounded-t-lg'>
            <div className='flex items-center text-white space-x-2'>
                <button className='bg-black rounded-full h-[40px] w-[40px] flex items-center justify-center'><FaChevronLeft size={20}/></button>
                <button className='bg-black rounded-full h-[40px] w-[40px] flex items-center justify-center'><FaChevronRight size={20}/></button>
            </div>

            {isLoggedIn ? 
                <div className='space-x-3 flex items-center'>
                    <Link className='text-grayText py-3 px-4 font-semibold' onClick={(e) => logoutHandler(e)}>Log Out</Link>
                    <Link to='/profile'>
                        <div className='bg-black h-[40px] w-[40px] rounded-full flex items-center justify-center'>
                            <img src={spotifyImage} alt='Profile Pic' className='h-[30px] w-[30px] rounded-full'/>
                        </div>
                    </Link>
                </div> :
                <div className='space-x-3 flex items-center'>
                    <Link to='/login' className='text-grayText py-3 px-4 font-semibold'>Log In</Link>
                    <Link to='/signup' className='bg-white py-3 px-4 text-black rounded-3xl font-semibold'>Sign Up</Link>
                </div>
            }
        </div>
    )
}

export default Navbar