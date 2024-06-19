import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext.jsx';
import formatDuration from '../utils/formatDuration.js';
import formatDate from '../utils/formatDate.js';

const PlaylistPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams()
    const [playlist, setPlaylist] = useState(null)
    const [playlistTracks, setPlaylistTracks] = useState(null)
    const [following, setFollowing] = useState(null)
    const { updateSidebar } = useContext(AuthContext)
    
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

    }, [searchParams, id])

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
                        creator: playlist.owner.display_name,
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
                    creator: playlist.owner.display_name,
                    description: playlist.description,
                    type: 'Playlist'
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
                updateSidebar()
            } else {
                const error = await response.json()
                console.error(error)
            }
        }
    }

    return (
        <div className='bg-primary flex flex-col px-5 pb-16 md:pb-2 h-fit pt-3 md:pt-0 space-y-4'>
            {playlist && 
                <div className='flex flex-col md:flex-row items-center'>
                    <img src={playlist.images[0].url} alt={playlist.name} className='h-[270px] w-[270px] rounded-md mx-auto md:mx-0'/>
                    <div className="flex flex-col text-white space-y-4 md:ml-4 mt-2 md:mt-0 w-full">
                        <div>Playlist</div>
                        <div className='text-4xl md:text-7xl font-bold name-width truncate pb-2 md:pb-4'>{playlist.name}</div>
                        {playlist.description.length > 0 && <div className='text-wrap text-sm'>{playlist.description}</div>}
                        <div className='flex space-x-3'>
                            <Link to={`/user/${playlist.owner.id}`} className='underline md:no-underline md:hover:underline'>{playlist.owner.display_name}</Link>
                            <div>{playlist.tracks.total} songs</div>
                        </div>
                    </div>
                    
                </div>
            }

            {/* conditional to check if user is logged in */}
            {!localStorage.getItem('userInfo') && <div className='text-xl text-grayText font-semibold'><Link to={'/login'} className='text-spotifyGreen underline md:no-underline md:hover:underline'>Log in</Link> or <Link to={'/signup'} className='text-spotifyGreen underline md:no-underline md:hover:underline'>Sign up</Link> to save the playlist to your library.</div>}
            {localStorage.getItem('userInfo') && following && <button onClick={() => handleFollowButton('unfollow')} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Unfollow</button>}
            {localStorage.getItem('userInfo') && !following && <button onClick={() => handleFollowButton('follow')} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Follow</button>}
            
            {/* grid section */}
            {playlistTracks && 
                <div className='grid sub-grid xl:hidden 2xl:hidden'>
                    <div className='grid-row text-grayText font-semibold'>
                        <div className="text-center  border-b-2 border-hoverGray">#</div>
                        <div className="text-left border-b-2 border-hoverGray">Title</div>
                        <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                    </div>

                    {playlistTracks.map((track, index) => {
                        if(track.track.id && track.track.type){
                            return (
                                <Link to={`/track/${track.track.id}`} className='grid-row' key={index}>
                                    {/* Counter */}
                                    <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1 + offset}</div>

                                    {/* Title and Artist */}
                                    <div className='grid-cell flex items-center text-left'>
                                        <img src={track.track.album.images[0].url} alt={track.track.name} className='h-[45px] w-[45px] rounded-md'/>
                                        <div className="flex flex-col ml-2">
                                            <div className='text-white'>{track.track.name}</div>
                                            <div className='text-sm text-grayText'>{track.track.artists[0].name}</div>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className='flex items-center justify-center text-grayText grid-cell '>{formatDuration(track.track.duration_ms)}</div>
                                </Link>
                            )
                        }
                    })}
                    
                </div>
            }

            {playlistTracks &&
                <div className='hidden xl:grid sub-grid 2xl:hidden'>
                    <div className='grid-row text-grayText font-semibold'>
                        <div className="text-center border-b-2 border-hoverGray">#</div>
                        <div className="text-left border-b-2 border-hoverGray">Title</div>
                        <div className="text-left border-b-2 border-hoverGray">Album</div>
                        <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                    </div>

                    {playlistTracks.map((track, index) => {
                        if(track.track.id && track.track.type){
                            return (
                                <Link to={`/track/${track.track.id}`} className='grid-row' key={index}>
                                    {/* Counter */}
                                    <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1 + offset}</div>

                                    {/* Title and Artist */}
                                    <div className='grid-cell flex items-center text-left'>
                                        <img src={track.track.album.images[0].url} alt={track.track.name} className='h-[45px] w-[45px] rounded-md'/>
                                        <div className="flex flex-col ml-2">
                                            <div className='text-white'>{track.track.name}</div>
                                            <div className='text-sm text-grayText'>{track.track.artists[0].name}</div>
                                        </div>
                                    </div>

                                    {/*Album */}
                                    <div className='flex items-center text-left text-grayText grid-cell'>{track.track.album.name}</div>

                                    {/* Duration */}
                                    <div className='flex items-center justify-center text-grayText grid-cell '>{formatDuration(track.track.duration_ms)}</div>
                                </Link>
                            )
                        }
                    })}
                </div>
            }

            {playlistTracks && 
                <div className='hidden 2xl:grid sub-grid'>
                    <div className='grid-row text-grayText font-semibold'>
                        <div className="text-center border-b-2 border-hoverGray">#</div>
                        <div className="text-left border-b-2 border-hoverGray">Title</div>
                        <div className="text-left border-b-2 border-hoverGray">Album</div>
                        <div className="text-left border-b-2 border-hoverGray">Date added</div>
                        <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                    </div>

                    {playlistTracks.map((track, index) => {
                        if(track.track.id && track.track.type){
                            return (
                                <Link to={`/track/${track.track.id}`} className='grid-row' key={index}>
                                    {/* Counter */}
                                    <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1 + offset}</div>

                                    {/* Title and Artist */}
                                    <div className='grid-cell flex items-center text-left'>
                                        <img src={track.track.album.images[0].url} alt={track.track.name} className='h-[45px] w-[45px] rounded-md'/>
                                        <div className="flex flex-col ml-2">
                                            <div className='text-white'>{track.track.name}</div>
                                            <div className='text-sm text-grayText'>{track.track.artists[0].name}</div>
                                        </div>
                                    </div>

                                    {/*Album */}
                                    <div className='flex items-center text-left text-grayText grid-cell'>{track.track.album.name}</div>

                                    {/* Date added */}
                                    <div className='flex items-center text-left text-grayText grid-cell'>{formatDate(track.added_at)}</div>

                                    {/* Duration */}
                                    <div className='flex items-center justify-center text-grayText grid-cell '>{formatDuration(track.track.duration_ms)}</div>
                                </Link>
                            )
                        }
                    })}
                </div>
            }

            {playlist && playlist.tracks.total > offset + 100 ? 
                    <div className='flex items-center justify-center'>
                        <button onClick={() => handleShowMore()} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Show more</button> 
                    </div>
                : null}

        </div>
    )
}

export default PlaylistPage