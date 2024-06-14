import React, { useEffect, useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'

const PlaylistPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams()
    const [playlist, setPlaylist] = useState(null)
    const [playlistTracks, setPlaylistTracks] = useState(null)
    const [following, setFollowing] = useState(null)
    
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const offset = Number(searchParams.get('offset')) ? Number(searchParams.get('offset')) : 0

    useEffect(() => {
        if(offset) {
            const getPlaylistData = async () => {
                const response = await fetch(`${apiBaseUrl}/spotify/get_playlist/${id}?offset=${offset}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok) {
                    const data = await response.json()
                    // console.log(data)
                    setPlaylist(data.playlist_data)
                    setPlaylistTracks(data.playlist_tracks)
                }
            }
            getPlaylistData()
        } else {
            const getPlaylistData = async () => {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
                const response = await fetch(`${apiBaseUrl}/spotify/get_playlist/${id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok) {
                    const data = await response.json()
                    // console.log(data)
                    setPlaylist(data.playlist_data)
                    setPlaylistTracks(data.playlist_tracks)
                }
            }
            getPlaylistData()
        }

    }, [searchParams])

    useEffect(() => {
        //Check user's following status if logged in
        if(localStorage.getItem('userInfo') && playlist){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getFavoriteStatus = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/follow_status/playlist/${id}`, {
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
                        name: playlist.name,
                        id: playlist.id,
                        image: playlist.images[0].url,
                        creator: playlist.owner.id,
                        description: playlist.description,
                        type: 'Playlist'
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
    }, [playlist])

    const handleShowMore = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('offset', offset + 100)
        setSearchParams(newParams);
    }

    const handleFollowButton = async (command) => {
        if(command === 'follow') {
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/profile/follow_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: playlist.name,
                    id: playlist.id,
                    image: playlist.images[0].url,
                    creator: playlist.owner.id,
                    description: playlist.description,
                    type: 'Playlist'
                })
            })
            if(response.ok) {
                setFollowing(true)
            } else {
                const error = await response.json()
                console.error(error)
            }
        } else {
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/profile/unfollow_item`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: playlist.id,
                    type: 'Playlist'
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
            {playlist && 
                <div>
                    {/* <img src={playlist.images[0].url} alt={playlist.name} /> */}
                    <div>Playlist</div>
                    <div>{playlist.name}</div>
                    <div>{playlist.description}</div>
                    <Link to={`/user/${playlist.owner.id}`}>{playlist.owner.display_name}</Link>
                    <div>{playlist.tracks.total} songs</div>
                </div>
            }

            {/* conditional to check if user is logged in */}
            {!localStorage.getItem('userInfo') && <div className='bg-blue-500'>Not logged in</div>}
            {localStorage.getItem('userInfo') && following && <button onClick={() => handleFollowButton('unfollow')} className='bg-blue-500 w-fit'>Unfollow</button>}
            {localStorage.getItem('userInfo') && !following && <button onClick={() => handleFollowButton('follow')} className='bg-blue-500 w-fit'>Follow</button>}

            {playlistTracks && 
                <div>
                    {playlistTracks.map((track, index) => {
                        if(track.track.id && track.track.type){
                            return <Link to={`/track/${track.track.id}`} key={index}>{track.track.name}</Link>
                        }
                    })}
                </div>
            }

            {playlist && playlist.tracks.total > offset + 100 ? <button onClick={() => handleShowMore()} className='bg-green-400'>Show more</button> : null}

        </div>
    )
}

export default PlaylistPage