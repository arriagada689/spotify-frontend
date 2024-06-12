import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const UserPlaylistPage = () => {
    const { id } = useParams()
    const [userPlaylist, setUserPlaylist] = useState(null)
    const [trackCount, setTrackCount] = useState(null)
    const [audiobookCount, setAudiobookCount] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = JSON.parse(localStorage.getItem('userInfo')).token

    useEffect(() => {
        //fetch user_playlist data
        const getUserPlaylistData = async () => {
            const response = await fetch(`${apiBaseUrl}/profile/get_user_playlist/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok) {
                const data = await response.json()
                // console.log(data)
                setTrackCount(data.track_count)
                setAudiobookCount(data.audiobook_count)
                setUserPlaylist(data.user_playlist)
            }
        }
        getUserPlaylistData()
    }, [])
  
    return (
        <div>
            {userPlaylist &&
                <div>
                    <div>Playlist</div>
                    <div>{userPlaylist.name}</div>
                    <div>{userPlaylist.description}</div>
                    {/* <div>{userPlaylist.playlist_items.length}</div> */}
                    {trackCount && audiobookCount && 
                        <div>{trackCount} song(s) {audiobookCount} audiobook(s)</div>
                    }
                    <Link to={`/profile`}>{userPlaylist.creator}</Link>
                </div>
            }
            <Link to={`/update_playlist/${id}`}>Update Playlist</Link>
            <Link to={`/confirm_playlist_delete/${id}`} className='bg-red-400'>Remove Playlist</Link>
        </div>
    )
}

export default UserPlaylistPage