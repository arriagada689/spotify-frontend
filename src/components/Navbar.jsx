import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import spotifyImage from '../assets/spotify_default2.jpg';
import { FaPlus } from "react-icons/fa6";

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
        navigate('/logout')
    }

    const goBack = () => {
        navigate(-1)
    }

    const goForwards = () => {
        navigate(1)
    }

    return (
        <div className='bg-primary flex justify-between p-3  md:rounded-t-lg'>
            <div className='flex items-center text-white space-x-2'>
                <button onClick={goBack} className='bg-black rounded-full h-[40px] w-[40px] flex items-center justify-center'><FaChevronLeft size={20}/></button>
                <button onClick={goForwards} className='bg-black rounded-full h-[40px] w-[40px] flex items-center justify-center'><FaChevronRight size={20}/></button>
            </div>

            {isLoggedIn && 
                <Link to='/create_playlist' className="flex items-center md:hidden justify-center text-grayText pl-3">
                    <FaPlus size={22}/>
                </Link>
            }

            {isLoggedIn ? 
                <div className='space-x-2 md:space-x-5 flex items-center'>
                    <Link className='text-grayText py-3 font-semibold hover:text-white' onClick={(e) => logoutHandler(e)}>Log Out</Link>
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