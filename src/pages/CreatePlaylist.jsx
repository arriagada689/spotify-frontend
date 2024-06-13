import React from 'react'
import { useState } from 'react';
import { Form, useNavigate } from 'react-router-dom'

const CreatePlaylist = () => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault()

        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/profile/create_playlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    description: description
                })
            })
            if(response.ok) {
                const data = await response.json()
                navigate(`/user_playlist/${data.user_playlist._id}`)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error){
            console.error(error)
            setErrorMessage(error.message)
        }
    }
    
    return (
        <div>
            <div>Create Playlist</div>
            {errorMessage && <div className='border-2 border-red-800 bg-red-300 p-1 px-2 w-fit text-red-600'>{errorMessage}</div>}
            <Form onSubmit={ submitHandler }>
                <div className='flex flex-col space-y-2 mb-2'>
                    <label htmlFor="username">Playlist name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        required
                        className='border border-gray-400 p-1 w-64 md:w-[450px]'
                    />
                    <div className='text-xs'>50 character limit</div>
                </div>
                

                <div className='flex flex-col space-y-2 mb-4'>
                    <label htmlFor="password">Description:</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='border border-gray-400 p-1 w-64 md:w-[450px]'
                    />
                    <div className='text-xs'>(Optional)</div>
                </div>
                
                <button type="submit" className='bg-blue-700 w-fit text-white py-2 px-3 rounded mb-4'>Create</button>
            </Form>
        </div>
    )
}

export default CreatePlaylist