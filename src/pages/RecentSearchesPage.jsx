import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import ArtistCard from '../components/ArtistCard.jsx';
import AlbumCard from '../components/AlbumCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';
import AudiobookCard from '../components/AudiobookCard.jsx';

const RecentSearchesPage = () => {
    const [recentlyViewed, setRecentlyViewed] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('userInfo')){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getRecentlyViewed = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/get_recently_viewed`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok) {
                    const data = await response.json()
                    // console.log(data)
                    setRecentlyViewed(data)
                } else {
                    const error = await response.json()
                    console.error(error)
                }
            }
            getRecentlyViewed()
        }
    }, [])

    const handleClearClick = async () => {
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        const response = await fetch(`${apiBaseUrl}/profile/wipe_recently_viewed`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok) {
            const data = await response.json()
            navigate('/search')
        }
    }
    
    return (
        <div>
            <div>Recent Searches</div>
            <button onClick={handleClearClick} className='bg-red-500'>Clear recent searches</button>
            {recentlyViewed && 
                <div>
                    {recentlyViewed.map((item, index) => {
                        // console.log(item)
                        if(item.type === 'Artist'){
                            return <ArtistCard key={index} name={item.name} id={item.id} image={item.image}/>
                        } else if(item.type === 'Album'){
                            return <AlbumCard key={index} name={item.name} id={item.id} image={item.image} artist={item.artist}/>
                        } else if(item.type === 'Playlist'){
                            return <PlaylistCard key={index} name={item.name} id={item.id} image={item.image} owner={item.owner}/>
                        } else if(item.type === 'Audiobook'){
                            return <AudiobookCard key={index} name={item.name} id={item.id} image={item.image} author={item.author}/>
                        } else if(item.type === 'Track'){
                            return <Link to={`/track/${item.id}`} key={index}>{item.name}</Link>
                        }
                    })}
                </div>
            }
        </div>
    )
}

export default RecentSearchesPage