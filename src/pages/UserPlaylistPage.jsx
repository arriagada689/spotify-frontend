import React, { useEffect, useState } from 'react'
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { FaSearch } from "react-icons/fa";

const UserPlaylistPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query')
    const type = searchParams.get('type') || 'track'
    const offset = Number(searchParams.get('offset')) || 0;
    const [input, setInput] = useState('')
    const [trackData, setTrackData] = useState(null)
    const [audiobookData, setAudiobookData] = useState(null)
    const [results, setResults] = useState(false)
    const [total, setTotal] = useState(null)
    const [update, setUpdate] = useState(0)
    const navigate = useNavigate();

    const { id } = useParams()
    const [userPlaylist, setUserPlaylist] = useState(null)
    const [trackCount, setTrackCount] = useState(null)
    const [audiobookCount, setAudiobookCount] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = JSON.parse(localStorage.getItem('userInfo')).token

    useEffect(() => {
        //fetch user_playlist data
        const getUserPlaylistData = async () => {
            const response = await fetch(`${apiBaseUrl}/profile/get_user_playlist/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok) {
                const data = await response.json()
                // console.log(data)
                setTrackCount(data.track_count)
                setAudiobookCount(data.audiobook_count)
                setUserPlaylist(data.user_playlist)
            }
        }
        getUserPlaylistData()
    }, [])

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        if(query){
            const searchQuery = async () => {
                let url = `${import.meta.env.VITE_API_BASE_URL}/profile/sub_search`;
                //attach query params
                if(query && type && offset){
                    url += `?query=${query}&type=${type}&offset=${String(offset)}&playlist_id=${id}`
                }
                else if(query && type){
                    url += `?query=${query}&type=${type}&playlist_id=${id}`
                }
                else if(query) {
                    url += `?query=${query}&playlist_id=${id}`
                }
    
                const response = await fetch(url, {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    }
                })
                if(response.ok) {
                    const data = await response.json();
                    setResults(true)
                    setTotal(data.total)
                    // console.log(data)
                    setTrackData(data.tracks);
                    setAudiobookData(data.audiobooks);
                } else {
                    const error = await response.json()
                    console.error(error)
                }
            }
            searchQuery()
        }
        
    }, [query, update])

    const handleSearch = (event) => {
        event.preventDefault(); 
        setSearchParams({ query: input });
    };

    const addToPlaylist = async (data, duration) => {
        //handle update state variable
        //two scenarios: add track or add audiobook
        if(data.type === 'track'){
            const response = await fetch(`${apiBaseUrl}/profile/add_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    playlist_id: id,
                    type: 'Track',
                    name: data.name,
                    id: data.id,
                    image: data.album.images[0].url,
                    artist: data.artists[0].name,
                    album: data.album.name,
                    duration: data.duration_ms
                })
            })
            if(response.ok) {
                setUpdate(prev => prev + 1)
            }
        } else if(data.type === 'audiobook') {
            const response = await fetch(`${apiBaseUrl}/profile/add_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    playlist_id: id,
                    type: 'Audiobook',
                    name: data.name,
                    id: data.id,
                    image: data.images[0].url,
                    author: data.authors[0].name,
                    duration: duration
                })
            })
            if(response.ok) {
                setUpdate(prev => prev + 1)
            }
        }
    }
    const removeFromPlaylist = async (data) => {
        //handle update state variable
        const response = await fetch(`${apiBaseUrl}/profile/remove_item`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                playlist_id: id,
                type: data.type === 'track' ? 'Track' : 'Audiobook',
                id: data.id
            })
        })
        if(response.ok) {
            setUpdate(prev => prev + 1)
        } else {
            const error = await response.json()
            console.error(error)
        }
    }

    const handleTypeClick = (type) => {
        if(type === 'track'){
            navigate(`/user_playlist/${id}?query=${query}&type=track`)
            setUpdate(prev => prev + 1)
        } else {
            navigate(`/user_playlist/${id}?query=${query}&type=audiobook`)
            setUpdate(prev => prev + 1)
        }
    }

    const handleShowMore = () => {
        navigate(`/user_playlist/${id}?query=${query}&type=${type}&offset=${offset + 10}`)
        setUpdate(prev => prev + 1)
    }
  
    return (
        <div>
            {userPlaylist &&
                <div>
                    <div>Playlist</div>
                    <div>{userPlaylist.name}</div>
                    <div>{userPlaylist.description}</div>
                    {/* <div>{userPlaylist.playlist_items.length}</div> */}
                    {trackCount && audiobookCount && 
                        <div>{trackCount} song(s) {audiobookCount} audiobook(s)</div>
                    }
                    <Link to={`/profile`}>{userPlaylist.creator}</Link>
                </div>
            }
            <Link to={`/update_playlist/${id}`}>Update Playlist</Link>
            <Link to={`/confirm_playlist_delete/${id}`} className='bg-red-400'>Remove Playlist</Link>

            {/* search bar */}
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit"><FaSearch /></button>
            </form>

            {/* filter buttons */}
            {results &&
            <div className='space-x-3'>
                <button onClick={() => handleTypeClick('track')} className={`${type === 'track' ? 'bg-white text-black' : 'bg-gray-400 text-white'}`}>Songs</button>
                <button onClick={() => handleTypeClick('audiobook')} className={`${type === 'audiobook' ? 'bg-white text-black' : 'bg-gray-400 text-white'}`}>Audiobooks</button>
                {/* <a href={`/user_playlist/${id}?query=${query}&type=track`} className={`${type === 'track' ? 'bg-white text-black' : 'bg-gray-400 text-white'}`}>Songs</a> */}
                {/* <a href={`/user_playlist/${id}?query=${query}&type=audiobook`} className={`${type === 'audiobook' ? 'bg-white text-black' : 'bg-gray-400 text-white'}`}>Audiobooks</a> */}
            </div>}

            {trackData && trackData.length > 0 &&
                <div className='flex flex-col'>
                    {trackData.map((item, index) => {
                        return <div className='space-x-3' key={index}>
                                <Link to={`/track/${item[1].id}`} >{item[1].name}</Link>
                                {item[0] ? 
                                    <button onClick={() => removeFromPlaylist(item[1])}>Remove</button> :
                                    <button onClick={() => addToPlaylist(item[1], null)}>Add</button>
                                }
                                </div> 
                    })}
                </div>
            }

            {audiobookData && audiobookData.length > 0 &&
                <div className='flex flex-col'>
                    {audiobookData.map((item, index) => {
                        return <div className='space-x-3' key={index}>
                                    <Link to={`/audiobook/${item[1].id}`}>{item[1].name}</Link>
                                    {item[0] ? 
                                        <button onClick={() => removeFromPlaylist(item[1])}>Remove</button> : 
                                        <button onClick={() => addToPlaylist(item[1], item[2])}>Add</button>
                                    }
                                </div>
                    })}
                </div>
            }

            {results && (total > (offset ? offset : 0) + 10) &&
                <button onClick={handleShowMore} className='bg-green-400'>Show more</button>
                // <a href={`/user_playlist/${id}?query=${query}&type=${type}&offset=${offset + 10}`} className='bg-green-400'>Show more</a>
            }
        </div>
    )
}

export default UserPlaylistPage