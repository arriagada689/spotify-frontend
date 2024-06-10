import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import AudiobookDescription from '../components/AudiobookDescription'

const AudiobookPage = () => {
    const { id } = useParams()
    const [audiobook, setAudiobook] = useState(null)
    const [duration, setDuration] = useState(null)
    const [following, setFollowing] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const getAudiobookData = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/spotify/get_audiobook/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                // console.log(data)
                setAudiobook(data.audiobook_data)
                setDuration(data.duration)
            }
        }
        getAudiobookData()

        //Check user's following status if logged in
        if(localStorage.getItem('userInfo')){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getFavoriteStatus = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/follow_status/audiobook/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok) {
                    const data = await response.json()
                    if(data.message === 'following'){
                        setFollowing(true)
                    } else {
                        setFollowing(false)
                    }
                }
            }
            getFavoriteStatus()
        }
    }, [])

    const handleFollowButton = async (command) => {
        if(command === 'follow'){
            //set up fetch to follow item endpoint
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/profile/follow_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: audiobook.name,
                    id: audiobook.id,
                    image: audiobook.images[0].url,
                    author: audiobook.authors[0].name,
                    duration: duration,
                    type: 'Audiobook'
                })
            })
            if(response.ok) {
                setFollowing(true)
            } else {
                const error = await response.json()
                console.error(error)
            }
        } else {
            //set up fetch to unfollow item endpoint
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/profile/unfollow_item`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: audiobook.id,
                    type: 'Audiobook'
                })
            })
            if(response.ok) {
                setFollowing(false)
            } else {
                const error = await response.json()
                console.error(error)
            }
        }
    }
    
    return (
        <div>
            {audiobook && 
                <div>
                    {/* <img src={audiobook.images[0].url} alt={audiobook.name} /> */}
                    <div>Audiobook</div>
                    <div>{audiobook.name}</div>
                    <div>{audiobook.authors[0].name}</div>
                </div>
            }

            {/* Conditional for CRUD */}
            {!localStorage.getItem('userInfo') && <div className='bg-blue-500'>Not logged in</div>}
            {localStorage.getItem('userInfo') && following ? 
                <button onClick={() => handleFollowButton('unfollow')} className='bg-blue-500 w-fit'>Unfollow</button> : 
                <button onClick={() => handleFollowButton('follow')} className='bg-blue-500 w-fit'>Follow</button>}

            {audiobook && 
                <div>
                    <div>
                        Narrated by 
                        {audiobook.narrators.map((narrator, index) => {
                            return <div key={index}>{narrator.name}</div>
                        })}
                    </div>

                    <div>Description:</div>
                    <AudiobookDescription description={audiobook.description}/>
                </div>
            }

        </div>
    )
}

export default AudiobookPage