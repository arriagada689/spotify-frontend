import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const AlbumPage = () => {
    const { id } = useParams()
    const [album, setAlbum] = useState(null)
    const [following, setFollowing] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const getAlbumData = async () => {
            const response = await fetch(`${apiBaseUrl}/spotify/get_album/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                // console.log(data)
                setAlbum(data.album_data)
            }
        }
        getAlbumData()

        
    }, [])

    useEffect(() => {
        //Check user's following status if logged in
        if(localStorage.getItem('userInfo') && album) {
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getFavoriteStatus = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/follow_status/album/${id}`, {
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
                } else {
                    const error = await response.json()
                    console.error(error)
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
                        name: album.name,
                        id: album.id,
                        image: album.images[0].url,
                        artist: album.artists[0].name,
                        type: 'Album'
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
    }, [album])

    const handleFollowButton = async (command) => {
        if(command === 'follow') {
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/profile/follow_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: album.name,
                    id: album.id,
                    image: album.images[0].url,
                    artist: album.artists[0].name,
                    type: 'Album'
                })
            })
            if(response.ok) {
                setFollowing(true)
            } else {
                const error = await response.json()
                console.error(error)
            }
        } else {
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const response = await fetch(`${apiBaseUrl}/profile/unfollow_item`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: album.id,
                    type: 'Album'
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
            {!localStorage.getItem('userInfo') && <div className='bg-blue-500'>Not logged in</div>}
            {localStorage.getItem('userInfo') && following ? 
                <button onClick={() => handleFollowButton('unfollow')} className='bg-blue-500 w-fit'>Unfollow</button> : 
                <button onClick={() => handleFollowButton('follow')} className='bg-blue-500 w-fit'>Follow</button>}

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