import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const AlbumPage = () => {
    const { id } = useParams()
    const [album, setAlbum] = useState(null)

    useEffect(() => {
        const getAlbumData = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/spotify/get_album/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                setAlbum(data.album_data)
            }
        }
        getAlbumData()
    }, [])
    
    return (
        <div>
            {album && 
                <div>
                    {/* <img src={album.images[0].url} alt={album.name} /> */}
                    <div>Album</div>
                    <div>{album.name}</div>
                    <div>{album.artists[0].name}</div>
                    <div>{album.release_date.substring(0, 4)}</div>
                    <div>{album.tracks.total} songs</div>
                </div>
            }

            {/* conditional to check if user is logged in */}

            {album && 
                <div className='flex flex-col'>
                    {album.tracks.items.map((track, index) => {
                        return <Link to={`/track/${track.id}`} key={index}>{track.name}</Link>
                    })}
                </div>
            }
        </div>
    )
}

export default AlbumPage