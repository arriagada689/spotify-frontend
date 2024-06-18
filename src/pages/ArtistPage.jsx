import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import ArtistCard from '../components/ArtistCard.jsx'
import spotifyImage from '../assets/spotify_default2.jpg';
import { AuthContext } from '../contexts/AuthContext.jsx';
import formatDuration from '../utils/formatDuration.js';

const colors = ['red2', 'blue2', 'green2', 'teal2', 'purple2']

const ArtistPage = () => {
    const { id } = useParams()
    const [artist, setArtist] = useState(null)
    const [popularTracks, setPopularTracks] = useState(null)
    const [relatedArtists, setRelatedArtists] = useState(null)
    const [following, setFollowing] = useState(null)
    const { updateSidebar } = useContext(AuthContext)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    const [bgColor, setBgColor] = useState(null)

    useEffect(() => {
        const getArtistData = async () => {
            const response = await fetch(`${apiBaseUrl}/spotify/get_artist/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                // console.log(data)
                setArtist(data.artist_data)
                setPopularTracks(data.popular_tracks)
                setRelatedArtists(data.related_artists)

                // Select a random color from the colors array
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                setBgColor(randomColor); // Update the bgColor state
            }
        }
        getArtistData()
        
    }, [id])

    useEffect(() => {
        //Check user's following status if logged in

        if(localStorage.getItem('userInfo') && artist){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getFavoriteStatus = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/follow_status/artist/${id}`, {
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
                        name: artist.name,
                        id: artist.id,
                        image: artist.images.length > 0 ? artist.images[0].url : 'default',
                        type: 'Artist'
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
    }, [artist])

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
                    name: artist.name,
                    id: artist.id,
                    image: artist.images.length > 0 ? artist.images[0].url : 'default',
                    type: 'Artist'
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
                    id: artist.id,
                    type: 'Artist'
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

    function concatenateStrings(stringsArray) {
        return stringsArray.join(", ");
    }
    
    return (
        <div className='bg-primary px-5 pb-16 md:pb-2 h-fit w-full pt-3 md:pt-0 md:rounded-b-md space-y-4'>
            {artist && 
                <div className='flex flex-col md:flex-row items-center'>
                    {artist.images.length > 0 ? <img src={artist.images[0].url} alt={artist.name} className='h-[270px] w-[270px] rounded-md mx-auto md:mx-0'/> : <img src={spotifyImage} alt='default image' className='h-[270px] w-[270px] rounded-md mx-auto md:mx-0'/>}
                    <div className="flex flex-col text-white space-y-4 md:ml-4  mt-2 md:mt-0">
                        <div>Artist</div>
                        <div className='text-4xl md:text-7xl font-bold truncate'>{artist.name}</div>
                        <a href={artist.external_urls.spotify} target="_blank"><span className='text-spotifyGreen underline md:hover:underline'>Spotify Link</span></a>

                        <div className='text-grayText text-wrap'>Genres: {artist.genres.join(', ')}</div>
                    </div>
                </div>
            }

            {/* conditional to check if user is logged in */}
            {!localStorage.getItem('userInfo') && <div className='text-xl text-grayText font-semibold'><Link to={'/login'} className='text-spotifyGreen underline md:no-underline md:hover:underline'>Log in</Link> or <Link to={'/signup'} className='text-spotifyGreen underline md:no-underline md:hover:underline'>Sign up</Link> to save the artist to your library.</div>}
            {localStorage.getItem('userInfo') && following && <button onClick={() => handleFollowButton('unfollow')} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Unfollow</button>}
            {localStorage.getItem('userInfo') && !following && <button onClick={() => handleFollowButton('follow')} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Follow</button>}

            {popularTracks && popularTracks.length > 0 &&
                <div>
                    <div className='text-2xl text-white font-bold mb-2'><span className='text-spotifyGreen'>{artist ? artist.name : ''}</span>'s top tracks</div>
                    <div className="flex-flex-col">
                        {popularTracks && 
                            popularTracks.map((track, index) => {
                                if(track){
                                    return <Link to={`/track/${track.id}`} key={index}>
                                                <div className='flex w-full bg-primary hover:bg-hoverGray items-center p-2 rounded-md'>
                                                    <img src={track.album.images[0].url} alt={track.name} className='h-[45px] w-[45px]'/>
                                                    <div className='flex w-full justify-between ml-2 items-center'>
                                                        <div className='flex flex-col'>
                                                            <div className='text-white'>{track.name}</div>
                                                            <div className='text-grayText text-sm'>{track.artists[0].name}</div>
                                                        </div>
                                                        <div className='text-grayText'>{formatDuration(track.duration_ms)}</div>
                                                    </div>
                                                </div>
                                           </Link>
                                }
                            })
                        }
                    </div>
                </div>
            }

            {relatedArtists && relatedArtists.length > 0 &&
                <div>
                    <div className='text-2xl text-white font-bold mb-2'>Related artists</div>
                    <div className='flex flex-wrap justify-center md:justify-start gap-y-4'>
                        {relatedArtists && 
                            relatedArtists.map((artist, index) => {
                                return <ArtistCard key={index} name={artist.name} image={artist.images.length > 0 ? artist.images[0].url : 'default'} id={artist.id}/>
                            })
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default ArtistPage