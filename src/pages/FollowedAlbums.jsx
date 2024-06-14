import React, { useEffect, useState } from 'react'
import AlbumCard from '../components/AlbumCard'

const FollowedAlbums = () => {
    const [data, setData] = useState(null)

    useEffect(() => {
        const getData = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/profile/get_sub_profile_data`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok) {
                const data = await response.json()
                setData(data)
            }
        }
        getData()
    }, [])
    
    return (
        <div>
            <div className="text-xl">Followed albums</div>

            {data &&
                <div>
                    {data.followed_albums.map((item, index) => {
                        return <AlbumCard key={index} name={item.name} id={item.id} image={item.image} artist={item.artist}/>
                    })}
                </div>
            }
        </div>
    )
}

export default FollowedAlbums