import React, { useEffect, useState } from 'react'
import { Form, useNavigate } from 'react-router-dom'

const UpdateProfile = () => {
    const [username, setUsername] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault()
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        try {
            const response = await fetch(`${apiBaseUrl}/profile/update_profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: username
                })
            })
            if(response.ok) {
                navigate(`/profile`)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error)
            setErrorMessage(error.message)
        }
    }
    
    return (
        <div>
            <div>Update Profile</div>
            {errorMessage && <div className='border-2 border-red-800 bg-red-300 p-1 px-2 w-fit text-red-600'>{errorMessage}</div>}
            <Form onSubmit={ submitHandler }>
                <div className='flex flex-col space-y-2 mb-2'>
                    <label htmlFor="username">New username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                        className='border border-gray-400 p-1 w-64 md:w-[450px]'
                    />
                </div>
                <button type="submit" className='bg-blue-700 w-fit text-white py-2 px-3 rounded mb-4'>Update</button>
            </Form>
        </div>
    )
}

export default UpdateProfile