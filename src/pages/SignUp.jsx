import React from 'react'
import { useState } from 'react'
import { Form, Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useContext } from 'react';
import { Oval } from 'react-loader-spinner'

const SignUp = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const { registerUser } = useContext(AuthContext)

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    confirm_password: confirmPassword 
                })
            })
            
            if (response.ok) {
                const data = await response.json()
                registerUser(data)
                navigate('/')
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            setErrorMessage(error.message)
        }
        setLoading(false)
    }
  
    return (
        <div>
            {!loading ?
                <div>
                    <div>Sign Up</div>
                    {errorMessage && <div className='border-2 border-red-800 bg-red-300 p-1 px-2 w-fit text-red-600'>{errorMessage}</div>}
                    
                    <Form onSubmit={ submitHandler }>
                        <div className='flex flex-col space-y-2 mb-2'>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username" 
                                required
                                className='border border-gray-400 p-1 w-64 md:w-[450px]'
                            />
                            <div className='text-xs'>Username must be 150 characters or fewer and contain only letters, digits and @/./+/-/_.</div>
                        </div>
                        <div className='flex flex-col space-y-2 mb-2'>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className='border border-gray-400 p-1 w-64 md:w-[450px]'
                            />
                            <div className='text-xs'>Password must be at least 4 characters long.</div>
                        </div>
                        
                        <div className='flex flex-col space-y-2 mb-4'>
                            <label htmlFor="password">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                                className='border border-gray-400 p-1 w-64 md:w-[450px]'
                            />
                        </div>
                        <button type="submit" className='bg-blue-700 w-fit text-white py-2 px-3 rounded mb-4'>Sign Up</button>
                
                        <div>Already have an account? <Link to='/login' className='text-blue-500 underline'>Log in</Link> </div>
                    </Form>
                </div>
                :
                <div>
                    <Oval
                    visible={true}
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    />
                </div>
            }
            
        </div>
  )
}

export default SignUp