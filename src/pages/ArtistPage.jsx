import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ArtistCard from '../components/ArtistCard.jsx'
import spotifyImage from '../assets/spotify_default2.jpg';

const ArtistPage = () => {
    const { id } = useParams()
    const [artist, setArtist] = useState(null)
    const [popularTracks, setPopularTracks] = useState(null)
    const [relatedArtists, setRelatedArtists] = useState(null)

    useEffect(() => {
        const getArtistData = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/spotify/get_artist/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                
                setArtist(data.artist_data)
                setPopularTracks(data.popular_tracks)
                setRelatedArtists(data.related_artists)
            }
        }
        getArtistData()
    }, [])
    
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