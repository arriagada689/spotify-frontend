import React, { useEffect, useState } from 'react'
import ArtistCard from '../components/ArtistCard'

const PopularArtists = () => {
    const [popularArtists, setPopularArtists] = useState(null)

    useEffect(() => {
        const getPopularArtists = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/spotify/popular_artists`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                setPopularArtists(data.popular_artists)
            }
        }
        getPopularArtists()
    }, [])

    return (
        <div>
            <div className='underline'>Popular artists</div>
            {popularArtists && 
                popularArtists.map((artist, index) => {
                    return <ArtistCard key={index} name={artist.name} image={artist.image} id={artist.id}/>
                })
            }
        </div>
    )
}

export default PopularArtists