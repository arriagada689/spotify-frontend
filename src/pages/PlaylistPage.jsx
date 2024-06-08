import React, { useEffect, useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'

const PlaylistPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams()
    const [playlist, setPlaylist] = useState(null)
    const [playlistTracks, setPlaylistTracks] = useState(null)
    
    const offset = searchParams.get('offset') ? searchParams.get('offset') : 0

    useEffect(() => {
        if(offset) {
            const getPlaylistData = async () => {
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
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

    const handleShowMore = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('offset', offset + 100)
        setSearchParams(newParams);
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

            {playlistTracks && 
                <div>
                    {playlistTracks.map((track, index) => {
                        return <Link to={`/track/${track.track.id}`} key={index}>{track.track.name}</Link>
                    })}
                </div>
            }

            {playlist && playlist.tracks.total > offset + 100 ? <button onClick={() => handleShowMore()} className='bg-green-400'>Show more</button> : null}

        </div>
    )
}

export default PlaylistPage