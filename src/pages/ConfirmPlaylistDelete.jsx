import React from 'react'
import { useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext.jsx';

const ConfirmPlaylistDelete = () => {
    const { id } = useParams()
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = JSON.parse(localStorage.getItem('userInfo')).token
    const { updateSidebar } = useContext(AuthContext)

    const navigate = useNavigate();

    const handlePlaylistDelete = async () => {
        //hit the endpoint and navigate back to home page
        const response = await fetch(`${apiBaseUrl}/profile/delete_user_playlist/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok) {
            const data = await response.json()
            updateSidebar()
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
            <button onClick={() => handlePlaylistDelete()}>Confirm</button>
            <button onClick={goBack}>Go back</button>
        </div>
    )
}

export default ConfirmPlaylistDelete