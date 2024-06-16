import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import AudiobookDescription from '../components/AudiobookDescription'
import { AuthContext } from '../contexts/AuthContext.jsx';

const AudiobookPage = () => {
    const { id } = useParams()
    const [audiobook, setAudiobook] = useState(null)
    const [duration, setDuration] = useState(null)
    const [following, setFollowing] = useState(null)
    const [update, setUpdate] = useState(0)
    const [userList, setUserList] = useState(null)
    const { updateSidebar } = useContext(AuthContext)

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

    }, [id])

    useEffect(() => {
        //if logged in, grab all the user's playlists for adding to playlist functionality
        if(localStorage.getItem('userInfo')){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getUserList = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/user_list/audiobook/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok) {
                    const data = await response.json()
                    setUserList(data.user_list)
                }
            }
            getUserList()
        }
    }, [update])

    useEffect(() => {
        //Check user's following status if logged in
        if(localStorage.getItem('userInfo') && audiobook){
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

            const addToRecentlyViewed = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/add_recently_viewed`, {
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
                    const data = await response.json()
                    // console.log(data)
                } else {
                    const error = await response.json()
                    console.log(error)
                }
            }
            addToRecentlyViewed()
        }
    }, [audiobook])

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
                updateSidebar()
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
                updateSidebar()
            } else {
                const error = await response.json()
                console.error(error)
            }
        }
    }

    const handlePlaylistFunctionality = async (user_playlist_id, command) => {
        //handle update state variable
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        if(command === 'add') {
            const response = await fetch(`${apiBaseUrl}/profile/add_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    playlist_id: user_playlist_id,
                    type: 'Audiobook',
                    name: audiobook.name,
                    id: audiobook.id,
                    image: audiobook.images[0].url,
                    author: audiobook.authors[0].name,
                    duration: duration
                })
            })
            if(response.ok) {
                setUpdate(prev => prev + 1)
            } else {
                const error = await response.json()
                console.error(error)
            }
        } else {
            const response = await fetch(`${apiBaseUrl}/profile/remove_item`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    playlist_id: user_playlist_id,
                    type: 'Audiobook',
                    id: audiobook.id
                })
            })
            if(response.ok) {
                setUpdate(prev => prev + 1)
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
            {localStorage.getItem('userInfo') && following && <button onClick={() => handleFollowButton('unfollow')} className='bg-blue-500 w-fit'>Unfollow</button>}
            {localStorage.getItem('userInfo') && !following && <button onClick={() => handleFollowButton('follow')} className='bg-blue-500 w-fit'>Follow</button>}
            
            {localStorage.getItem('userInfo') && userList &&
                <div className='border flex flex-col'>
                    <div className='text-xl'>Add to playlist</div>
                    {userList.map((user_playlist, index) => {
                        return <button 
                                onClick={() => handlePlaylistFunctionality(user_playlist[0], user_playlist[2] ? 'remove' : 'add')} 
                                className='border w-fit' 
                                key={index}>
                                    {user_playlist[1]} {user_playlist[2] ? 'is in' : 'not in'}
                                </button>
                    })}
                </div>
            }

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