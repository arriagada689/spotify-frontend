import React, { useEffect, useState } from 'react'
import PlaylistCard from '../components/PlaylistCard'

const SavedPlaylistsPage = () => {
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
            <div className='text-xl'>Saved Playlists</div>

            {data &&
                <div>
                    {data.saved_playlists.map((item, index) => {
                        if(item.type === 'Playlist'){
                            return <PlaylistCard key={index} name={item.name} id={item.id} image={item.image} owner={item.creator}/>
                        } else if(item.type === 'UserPlaylist'){
                            return <PlaylistCard key={index} name={item.name} id={item.id} image={'default'} owner={item.creator}/>
                        }
                    })}
                </div>
            }
        </div>
    )
}

export default SavedPlaylistsPage