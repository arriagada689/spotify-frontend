import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

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
        <div className='border'>
            {isLoggedIn ? 
                <div className='space-x-3'>
                    <Link to='/profile'>Profile</Link>
                    <Link onClick={(e) => logoutHandler(e)}>Log Out</Link>
                </div> :
                <div className='space-x-3'>
                    <Link to='/login'>Log In</Link>
                    <Link to='/signup'>Sign Up</Link>
                </div>
            }
        </div>
    )
}

export default Navbar