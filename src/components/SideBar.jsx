import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import ArtistCard from './ArtistCard'
import AlbumCard from './AlbumCard'
import PlaylistCard from './PlaylistCard'
import AudiobookCard from './AudiobookCard'
import { IoMdClose } from "react-icons/io";
import { AuthContext } from '../contexts/AuthContext.jsx';

const SideBar = () => {
    const [arr, setArr] = useState(null)
    const [type, setType] = useState('All')
    const { sidebarUpdate } = useContext(AuthContext);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    
    useEffect(() => {
        if(localStorage.getItem('userInfo')){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getSidebarData = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/sidebar_data?type=${type}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok) {
                    const data = await response.json()
                    // console.log(data)
                    setArr(data)
                }
            }
            getSidebarData()
        } else {
            setArr(null)
        }
        
    }, [type, sidebarUpdate, localStorage.getItem('userInfo')])

    const handleTypeClick = (type) => {
        setType(type)
    }
    
    return (
        <div className='fixed h-[60px] w-full bottom-0 md:top-0 md:left-0 md:h-full md:w-[375px] border md:m-1'>
            <div className="flex flex-row md:flex-col">
                <Link to='/'>Home</Link>
                <Link to='/search'>Search</Link>

                <div className='flex flex-col'>
                    <Link to='/create_playlist'>Create Playlist</Link>

                    {/* sidebar filter section */}
                    {arr && type === 'All' && 
                        <div className='space-x-2'>
                            <button onClick={() => handleTypeClick('Playlist')} className='bg-gray-500 text-white'>Playlists</button>
                            <button onClick={() => handleTypeClick('Artist')} className='bg-gray-500 text-white'>Artists</button>
                            <button onClick={() => handleTypeClick('Album')} className='bg-gray-500 text-white'>Albums</button>
                            <button onClick={() => handleTypeClick('Audiobook')} className='bg-gray-500 text-white'>Audiobooks</button>
                        </div>  
                    }
                    {(type === 'Playlist' || type === 'UserPlaylist') &&
                        <div className='space-x-2'>
                            <button onClick={() => handleTypeClick('All')} className='bg-gray-500 text-white'><IoMdClose /></button>
                            <button onClick={() => handleTypeClick('Playlist')} className={`${type === 'Playlist' ? 'bg-white text-black' : 'bg-gray-500 text-white'}`}>Playlists</button>
                            <button onClick={() => handleTypeClick('UserPlaylist')} className={`${type === 'UserPlaylist' ? 'bg-white text-black' : 'bg-gray-500 text-white'}`}>By you</button>
                        </div> 
                    }
                    {arr && type === 'Artist' &&
                        <div className='space-x-2'>
                            <button onClick={() => handleTypeClick('All')} className='bg-gray-500 text-white'><IoMdClose /></button>
                            <button onClick={() => handleTypeClick('Artist')} className={`${type === 'Artist' ? 'bg-white text-black' : 'bg-gray-500 text-white'}`}>Artists</button>
                        </div> 
                    }
                    {arr && type === 'Album' &&
                        <div className='space-x-2'>
                            <button onClick={() => handleTypeClick('All')} className='bg-gray-500 text-white'><IoMdClose /></button>
                            <button onClick={() => handleTypeClick('Album')} className={`${type === 'Album' ? 'bg-white text-black' : 'bg-gray-500 text-white'}`}>Albums</button>
                        </div> 
                    }
                    {arr && type === 'Audiobook' &&
                        <div className='space-x-2'>
                            <button onClick={() => handleTypeClick('All')} className='bg-gray-500 text-white'><IoMdClose /></button>
                            <button onClick={() => handleTypeClick('Audiobook')} className={`${type === 'Audiobook' ? 'bg-white text-black' : 'bg-gray-500 text-white'}`}>Audiobooks</button>
                        </div> 
                    }

                    {arr && 
                        arr.map((item, index) => {
                            if(item.type === 'Artist'){
                                return <ArtistCard key={index} name={item.name} id={item.id} image={item.image}/>
                            } else if(item.type === 'Album'){
                                return <AlbumCard key={index} name={item.name} id={item.id} image={item.image} artist={item.artist}/>
                            } else if(item.type === 'Playlist'){
                                return <PlaylistCard key={index} name={item.name} id={item.id} image={item.image} owner={item.creator}/>
                            } else if(item.type === 'Audiobook'){
                                return <AudiobookCard key={index} name={item.name} id={item.id} image={item.image} author={item.author}/>
                            } else if(item.type === 'UserPlaylist'){
                                return <Link to={`/user_playlist/${item._id}`} key={index}>{item.name}</Link>
                            }
                        })
                    }
                </div>
                
            </div>
        </div>
    )
}

export default SideBar