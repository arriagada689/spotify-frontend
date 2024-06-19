import React, { useEffect, useState } from 'react'
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { FaSearch } from "react-icons/fa";
import { Oval } from 'react-loader-spinner'
import spotifyImage from '../assets/spotify_default2.jpg';

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
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [isInputFocused, setInputFocused] = useState(false);

    const { id } = useParams()
    const [userPlaylist, setUserPlaylist] = useState(null)
    const [playlistItems, setPlaylistItems] = useState(null)
    const [addedOn, setAddedOn] = useState(null)
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
                setPlaylistItems(data.playlist_items)
                setAddedOn(data.added_on)
            }
        }
        getUserPlaylistData()
    }, [id, searchParams, update])

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        if(query){
            setLoading(true)
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
                    setLoading(false)
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

    const divClassNames = `flex items-center rounded-3xl bg-hoverGray text-grayText py-3 px-2 space-x-2 w-full md:w-1/2 
    ${isInputFocused ? 'outline outline-2 outline-white outline-offset-2' : ''}`;

    const buttonClassNames = `${isInputFocused ? 'text-white' : 'text-grayText'}`;
  
    return (
        <div className='bg-primary flex flex-col px-5 pb-16 md:pb-2 h-fit pt-3 md:pt-0 space-y-4'>
            {userPlaylist && 
                <div className='flex flex-col md:flex-row items-center'>
                    <img src={spotifyImage} alt='default image' className='h-[270px] w-[270px] rounded-md mx-auto md:mx-0'/>
                    <div className="flex flex-col text-white space-y-4 md:ml-4 mt-2 md:mt-0 w-full">
                        <div>Playlist</div>
                        <div className='text-4xl md:text-7xl font-bold name-width truncate pb-2 md:pb-4'>{userPlaylist.name}</div>
                        {userPlaylist.description.length > 0 && <div className='text-wrap text-sm'>{userPlaylist.description}</div>}
                        <div className='flex space-x-3'>
                            <Link to={`/profile`} className='underline md:no-underline md:hover:underline'>{userPlaylist.creator}</Link>
                            <div className='text-white'>{trackCount} song(s) {audiobookCount} audiobook(s)</div>
                        </div>
                    </div>
                </div>
            }
            <div className="flex items-center space-x-3">
                <Link to={`/update_playlist/${id}`} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Update Playlist</Link>
                <Link to={`/confirm_playlist_delete/${id}`} className='bg-red-500 w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Remove Playlist</Link>
            </div>

            {/* grid section */}
            {playlistItems && 
                <div className='grid sub-grid xl:hidden 2xl:hidden'>
                    <div className='grid-row text-grayText font-semibold'>
                        <div className="text-center  border-b-2 border-hoverGray">#</div>
                        <div className="text-left border-b-2 border-hoverGray">Title</div>
                        <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                    </div>

                    {playlistItems.map((item, index) => {
                        return <Link to={item.type === 'Track' ? `/track/${item.id}` : `/audiobook/${item.id}`} className='grid-row' key={index}>
                                    {/* Counter */}
                                    <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1}</div>   

                                    {/* Title and Artist */}
                                    <div className='grid-cell flex items-center text-left'>
                                        <img src={item.image} alt={item.name} className='h-[45px] w-[45px] rounded-md' />
                                        <div className="flex flex-col ml-2">
                                            <div className='text-white'>{item.name}</div>
                                            <div className='text-sm text-grayText'>{item.type === 'Track' ? item.artist : item.author}</div>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className='flex items-center justify-center text-grayText grid-cell '>{item.duration}</div>
                                </Link>
                    })}
                </div>
            }

            {playlistItems &&
                <div className='hidden xl:grid sub-grid 2xl:hidden'>
                    <div className='grid-row text-grayText font-semibold'>
                        <div className="text-center  border-b-2 border-hoverGray">#</div>
                        <div className="text-left border-b-2 border-hoverGray">Title</div>
                        <div className="text-left border-b-2 border-hoverGray">Album</div>
                        <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                    </div>

                    {playlistItems.map((item, index) => {
                        return <Link to={item.type === 'Track' ? `/track/${item.id}` : `/audiobook/${item.id}`} className='grid-row' key={index}>
                                    {/* Counter */}
                                    <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1}</div>   

                                    {/* Title and Artist */}
                                    <div className='grid-cell flex items-center text-left'>
                                        <img src={item.image} alt={item.name} className='h-[45px] w-[45px] rounded-md' />
                                        <div className="flex flex-col ml-2">
                                            <div className='text-white'>{item.name}</div>
                                            <div className='text-sm text-grayText'>{item.type === 'Track' ? item.artist : item.author}</div>
                                        </div>
                                    </div>

                                    {/*Album */}
                                    <div className='flex items-center text-left text-grayText grid-cell'>{item.type === 'Track' ? item.album : ''}</div>

                                    {/* Duration */}
                                    <div className='flex items-center justify-center text-grayText grid-cell '>{item.duration}</div>
                                </Link>
                    })}
                </div>
            }

            {playlistItems && addedOn &&
                <div className='hidden 2xl:grid sub-grid'>
                    <div className='grid-row text-grayText font-semibold'>
                        <div className="text-center  border-b-2 border-hoverGray">#</div>
                        <div className="text-left border-b-2 border-hoverGray">Title</div>
                        <div className="text-left border-b-2 border-hoverGray">Album</div>
                        <div className="text-left border-b-2 border-hoverGray">Date added</div>
                        <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                    </div>

                    {playlistItems.map((item, index) => {
                        return <Link to={item.type === 'Track' ? `/track/${item.id}` : `/audiobook/${item.id}`} className='grid-row' key={index}>
                                    {/* Counter */}
                                    <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1}</div>   

                                    {/* Title and Artist */}
                                    <div className='grid-cell flex items-center text-left'>
                                        <img src={item.image} alt={item.name} className='h-[45px] w-[45px] rounded-md' />
                                        <div className="flex flex-col ml-2">
                                            <div className='text-white'>{item.name}</div>
                                            <div className='text-sm text-grayText'>{item.type === 'Track' ? item.artist : item.author}</div>
                                        </div>
                                    </div>

                                    {/*Album */}
                                    <div className='flex items-center text-left text-grayText grid-cell'>{item.type === 'Track' ? item.album : ''}</div>

                                    {/* Date added */}
                                    <div className='flex items-center text-left text-grayText grid-cell'>{addedOn[index]}</div>

                                    {/* Duration */}
                                    <div className='flex items-center justify-center text-grayText grid-cell '>{item.duration}</div>
                                </Link>
                    })}
                </div>
            }

            {/* search bar */}
            <form onSubmit={handleSearch}>
                <div tabIndex={0} className={divClassNames}>
                    <button type="submit" className={buttonClassNames}><FaSearch /></button>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className='bg-transparent w-full h-full focus:outline-none'
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                    />
                </div>
            </form>

            {loading ? 
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
                :
                <div className='space-y-5'>
                    {/* filter buttons */}
                    {results &&
                    <div className='flex space-x-3'>
                        <button onClick={() => handleTypeClick('track')} className={`${type === 'track' ? 'text-black bg-white' : 'text-white bg-filterButton'} text-sm md:text-base rounded-2xl px-3 py-2`}>Songs</button>
                        <button onClick={() => handleTypeClick('audiobook')} className={`${type === 'audiobook' ? 'text-black bg-white' : 'text-white bg-filterButton'} text-sm md:text-base rounded-2xl px-3 py-2`}>Audiobooks</button>
                    </div>}

                    {trackData && trackData.length > 0 &&
                        <div className='flex flex-col'>
                            {trackData.map((item, index) => {
                                return <Link to={`/track/${item[1].id}`} key={index}>
                                            <div className='flex w-full bg-primary hover:bg-hoverGray items-center p-2 rounded-md'>
                                                <img src={item[1].album.images[0].url} alt={item[1].name} className='h-[45px] w-[45px]'/>
                                                <div className='flex w-full justify-between ml-2 items-center'>
                                                    <div className='flex flex-col'>
                                                        <div className='text-white'>{item[1].name}</div>
                                                        <div className='text-grayText text-sm'>{item[1].artists[0].name}</div>
                                                    </div>
                                                    {item[0] ? 
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation(); 
                                                            removeFromPlaylist(item[1]);
                                                        }} className='text-white bg-filterButton text-sm rounded-2xl px-3 py-2'>Remove</button> :
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation(); 
                                                            addToPlaylist(item[1], null);
                                                        }} className='text-white bg-filterButton text-sm rounded-2xl px-3 py-2'>Add</button>
                                                    }
                                                </div>
                                            </div>
                                        </Link> 
                            })}
                        </div>
                    }

                    {audiobookData && audiobookData.length > 0 &&
                        <div className='flex flex-col'>
                            {audiobookData.map((item, index) => {
                                return <Link to={`/audiobook/${item[1].id}`} className='space-x-3' key={index}>
                                            <div className='flex w-full bg-primary hover:bg-hoverGray items-center p-2 rounded-md'>
                                                <img src={item[1].images[0].url} alt={item[1].name} className='h-[45px] w-[45px]'/>
                                                <div className='flex w-full justify-between ml-2 items-center'>
                                                    <div className='flex flex-col'>
                                                        <div className='text-white'>{item[1].name}</div>
                                                        <div className='text-grayText text-sm'>{item[1].authors[0].name}</div>
                                                    </div>
                                                    {item[0] ? 
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            removeFromPlaylist(item[1])
                                                        }} className='text-white bg-filterButton text-sm rounded-2xl px-3 py-2'>Remove</button> : 
                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            addToPlaylist(item[1], item[2])
                                                        }} className='text-white bg-filterButton text-sm rounded-2xl px-3 py-2'>Add</button>
                                                    }
                                                </div>
                                            </div>
                                        </Link>
                            })}
                        </div>
                    }

                    {results && (total > (offset ? offset : 0) + 10) &&
                        <button onClick={handleShowMore} className='bg-spotifyGreen w-fit font-semibold py-2 px-3 rounded-2xl'>Show more</button>
                    }
                </div>
            }
            
        </div>
    )
}

export default UserPlaylistPage