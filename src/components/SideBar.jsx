import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import ArtistCard from './ArtistCard'
import AlbumCard from './AlbumCard'
import PlaylistCard from './PlaylistCard'
import AudiobookCard from './AudiobookCard'
import { AuthContext } from '../contexts/AuthContext.jsx';
import SidebarFilterButtons from './SidebarFilterButtons.jsx'
import { Oval } from 'react-loader-spinner'

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

                    {/*Sidebar 3 conditions: not logged in, logged in loading, logged in loaded */}
                    {!localStorage.getItem('userInfo') && 
                        <div>Not logged in</div>
                    }

                    {/* sidebar filter section */}
                    {localStorage.getItem('userInfo') && !arr &&
                        <div>
                            <Oval
                            visible={true}
                            height="80"
                            width="80"
                            color="#4fa94d"
                            ariaLabel="oval-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            />
                        </div>
                    }
                    {localStorage.getItem('userInfo') && arr && 
                        <div>
                            <SidebarFilterButtons arr={arr} handleTypeClick={handleTypeClick} type={type}/>

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
                    }
                    
                </div>
                
            </div>
        </div>
    )
}

export default SideBar