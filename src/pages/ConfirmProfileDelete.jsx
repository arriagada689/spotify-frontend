import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

const ConfirmProfileDelete = () => {
    const { deleteProfile } = useContext(AuthContext)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = JSON.parse(localStorage.getItem('userInfo')).token

    const navigate = useNavigate();

    const handleProfileDelete = async () => {
        //hit the endpoint and navigate back to home page
        const response = await fetch(`${apiBaseUrl}/profile/delete_profile`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok) {
            deleteProfile()
            navigate('/')
        } else {
            const error = await response.json()
            console.error(error)
        }
    }

    const goBack = () => {
        navigate(-1)
    }

    return (
        <div>
            <button onClick={() => handleProfileDelete()}>Confirm</button>
            <button onClick={goBack}>Go back</button>
        </div>
    )
}

export default ConfirmProfileDelete