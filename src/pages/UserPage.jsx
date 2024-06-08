import React, { useEffect, useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import spotifyImage from '../assets/spotify_default2.jpg';
import PlaylistCard from '../components/PlaylistCard.jsx';

const UserPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { id } = useParams()
    const [user, setUser] = useState(null)
    const [userPlaylists, setUserPlaylists] = useState(null)

    const offset = searchParams.get('offset') ? searchParams.get('offset') : 0

    useEffect(() => {
        const getUserData = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/spotify/get_user/${id}?offset=${offset}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                // console.log(data)
                setUser(data.user_data)
                setUserPlaylists(data.user_playlists)
            }
        }
        getUserData()
    }, [searchParams])

    const handleMore = () => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set('offset', offset + 50)
        setSearchParams(newParams)
    }
    
    return (
        <div>
            {user && 
                <div>
                    {/* {user.images.length > 0 ? <img src={user.images[0].url} alt={user.name} /> : <img src={spotifyImage} alt='default image' />} */}
                    <div>Profile</div>
                    <div>{user.display_name}</div>
                </div>
            }

            {userPlaylists && 
                <div>
                    <div className="text-xl">Public playlists</div>
                    
                    {userPlaylists.items.map((playlist, index) => {
                        return <PlaylistCard key={index} name={playlist.name} owner={playlist.owner.display_name} image={playlist.images[0].url} id={playlist.id}/>
                    })}
                </div>
            }

            {userPlaylists && userPlaylists.total > offset + 50 ? <button onClick={() => handleMore()} className='bg-green-400'>Show more</button> : null}
        </div>
    )
}

export default UserPage