import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ArtistCard from './ArtistCard'
import AlbumCard from './AlbumCard'
import PlaylistCard from './PlaylistCard'
import AudiobookCard from './AudiobookCard'

const SideBar = () => {
    const [arr, setArr] = useState(null)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    
    useEffect(() => {
        if(localStorage.getItem('userInfo')){
            const token = JSON.parse(localStorage.getItem('userInfo')).token
            const getSidebarData = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/sidebar_data`, {
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
        }
        
    }, [])
    
    return (
        <div className='fixed h-[60px] w-full bottom-0 md:top-0 md:left-0 md:h-full md:w-[375px] border md:m-1'>
            <div className="flex flex-row md:flex-col">
                <Link to='/'>Home</Link>
                <Link to='/search'>Search</Link>
                <Link to='/create_playlist'>Create Playlist</Link>

                {arr && 
                    arr.map((item, index) => {
                        if(item.type === 'Artist'){
                            return <ArtistCard key={index} name={item.name} id={item.id} image={item.image}/>
                        } else if(item.type === 'Album'){
                            return <AlbumCard key={index} name={item.name} id={item.id} image={item.image} artist={item.artist}/>
                        } else if(item.type === 'Playlist'){
                            return <PlaylistCard key={index} name={item.name} id={item.id} image={item.image} owner={item.owner}/>
                        } else if(item.type === 'Audiobook'){
                            return <AudiobookCard key={index} name={item.name} id={item.id} image={item.image} author={item.author}/>
                        } else if(item.type === 'UserPlaylist'){
                            return <Link to={`/user_playlist/${item._id}`} key={index}>{item.name}</Link>
                        }
                    })
                }
            </div>
        </div>
    )
}

export default SideBar