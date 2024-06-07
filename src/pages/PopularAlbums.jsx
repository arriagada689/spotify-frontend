import React, { useState, useEffect } from 'react'
import AlbumCard from '../components/AlbumCard'

const PopularAlbums = () => {
    const [popularAlbums, setPopularAlbums] = useState(null)

    useEffect(() => {
        const getPopularAlbums = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/spotify/popular_albums`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                setPopularAlbums(data.popular_albums)
            }
        }
        getPopularAlbums()
    }, [])

    
    return (
        <div>
            <div className='underline'>Popular albums</div>
            {popularAlbums && 
                popularAlbums.map((albums, index) => {
                    return <AlbumCard key={index} name={albums.name} image={albums.image} id={albums.id}/>
                })
            }
        </div>
    )
}

export default PopularAlbums