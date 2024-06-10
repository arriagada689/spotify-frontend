import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ArtistCard from '../components/ArtistCard.jsx'
import spotifyImage from '../assets/spotify_default2.jpg';

const ArtistPage = () => {
    const { id } = useParams()
    const [artist, setArtist] = useState(null)
    const [popularTracks, setPopularTracks] = useState(null)
    const [relatedArtists, setRelatedArtists] = useState(null)
    const [following, setFollowing] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

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
            }
        }
        getArtistData()

        //Check user's following status if logged in
        if(localStorage.getItem('userInfo')){
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
                    name: artist.name,
                    id: artist.id,
                    image: artist.images[0].url,
                    type: 'Artist'
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
                    id: artist.id,
                    type: 'Artist'
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
            {artist && 
                <div>
                    {/* {artist.images.length > 0 ? <img src={artist.images[0].url} alt={artist.name} /> : <img src={spotifyImage} alt='default image' />} */}
                    <div>Artist</div>
                    <div>{artist.name}</div>
                    <a href={artist.external_urls.spotify} target="_blank">Spotify Link</a>

                    <div>Genres:</div>
                    {artist.genres.map((genre, index) => {
                        return <div key={index}>{genre}</div>
                    })}
                </div>
            }

            {/* conditional to check if user is logged in */}
            {!localStorage.getItem('userInfo') && <div className='bg-blue-500'>Not logged in</div>}
            {localStorage.getItem('userInfo') && following ? 
                <button onClick={() => handleFollowButton('unfollow')} className='bg-blue-500 w-fit'>Unfollow</button> : 
                <button onClick={() => handleFollowButton('follow')} className='bg-blue-500 w-fit'>Follow</button>}

            {popularTracks && 
                <div>
                    <div className="text-xl"><span className='text-green-500'>{artist ? artist.name : ''}</span>'s top tracks</div>
                    {popularTracks && 
                        popularTracks.map((track, index) => {
                            return <Link to={`/track/${track.id}`} key={index}>{track.name}</Link>
                        })
                    }
                </div>
            }

            {relatedArtists && 
                <div>
                    <div className="text-xl">Related artists</div>
                    {relatedArtists && 
                        relatedArtists.map((artist, index) => {
                            return <ArtistCard key={index} name={artist.name} image={artist.images[0].url} id={artist.id}/>
                        })
                    }
                </div>
            }
        </div>
    )
}

export default ArtistPage