import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const TrackPage = () => {
    const { id } = useParams()
    const [track, setTrack] = useState(null)
    const [popularTracks, setPopularTracks] = useState(null)
    const [albumData, setAlbumData] = useState(null)
    const [update, setUpdate] = useState(0)
    const [userList, setUserList] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const getTrackData = async () => {
            const response = await fetch(`${apiBaseUrl}/spotify/get_track/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                setTrack(data.track_data)
                setPopularTracks(data.popular_tracks)
                setAlbumData(data.album_data)
            }
        }
        getTrackData()
    }, [id])

    useEffect(() => {
        //if logged in, grab all the user's playlists for adding to playlist functionality
        
        if(localStorage.getItem('userInfo')){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getUserList = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/user_list/track/${id}`, {
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
        
        if(localStorage.getItem('userInfo') && track){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const addToRecentlyViewed = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/add_recently_viewed`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: track.name,
                        id: track.id,
                        image: track.album.images[0].url,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        duration: track.duration_ms,
                        type: 'Track'
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
    }, [track])

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
                    type: 'Track',
                    name: track.name,
                    id: track.id,
                    image: track.album.images[0].url,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    duration: track.duration_ms
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
                    type: 'Track',
                    id: track.id
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
            {track && 
                <div>
                    {/* <img src={track.album.images[0].url} alt={track.name} /> */}
                    <div>Song</div>
                    <div>{track.name}</div>
                    <div>{track.artists[0].name}</div>
                    <div>{track.album.name}</div>
                    <div>{track.album.release_date.substring(0,4)}</div>
                </div>
            }

            {/* conditional to check if user is logged in */}
            {!localStorage.getItem('userInfo') && <div className='bg-blue-500'>Not logged in</div>}
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

            {/* Preview song button */}
            {track && <a className='bg-green-400' href={track.preview_url} target='_blank'>Preview Song</a>}

            {popularTracks && 
                <div>
                    <div className="text-xl">Popular tracks by <span className='text-green-500'>{track ? track.artists[0].name : ''}</span></div>
                    {popularTracks.map((popular_track, index) => {
                        return <Link to={`/track/${popular_track.id}`} key={index}>{popular_track.name}</Link>
                    })}
                </div>
            }

            {albumData && 
                <div>
                    <div className="text-xl">More from the album <span className='text-green-500'>{track ? track.album.name : ''}</span></div>
                    {albumData.map((album_track, index) => {
                        return <div key={index}>{album_track.name}</div>
                    })}
                </div>
            }

        </div>
    )
}

export default TrackPage