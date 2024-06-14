import React, { useEffect, useState, useMemo } from 'react'
import CategoryCard from '../components/CategoryCard.jsx'
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import ArtistCard from '../components/ArtistCard.jsx';
import { FaSearch } from "react-icons/fa";
import AlbumCard from '../components/AlbumCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';
import AudiobookCard from '../components/AudiobookCard.jsx';
import { Oval } from 'react-loader-spinner'

const staticCategories = [
    "acoustic",
    "afrobeat",
    "alt-rock",
    "alternative",
    "ambient",
    "anime",
    "black-metal",
    "bluegrass",
    "blues",
    "bossanova",
    "brazil",
    "breakbeat",
    "british",
    "cantopop",
    "chicago-house",
    "children",
    "chill",
    "classical",
    "club",
    "comedy",
    "country",
    "dance",
    "dancehall",
    "death-metal",
    "deep-house",
    "detroit-techno",
    "disco",
    "disney",
    "drum-and-bass",
    "dub",
    "dubstep",
    "edm",
    "electro",
    "electronic",
    "emo",
    "folk",
    "forro",
    "french",
    "funk",
    "garage",
    "german",
    "gospel",
    "goth",
    "grindcore",
    "groove",
    "grunge",
    "guitar",
    "happy",
    "hard-rock",
    "hardcore",
    "hardstyle",
    "heavy-metal",
    "hip-hop",
    "holidays",
    "honky-tonk",
    "house",
    "idm",
    "indian",
    "indie",
    "indie-pop",
    "industrial",
    "iranian",
    "j-dance",
    "j-idol",
    "j-pop",
    "j-rock",
    "jazz",
    "k-pop",
    "kids",
    "latin",
    "latino",
    "malay",
    "mandopop",
    "metal",
    "metal-misc",
    "metalcore",
    "minimal-techno",
    "movies",
    "mpb",
    "new-age",
    "new-release",
    "opera",
    "pagode",
    "party",
    "philippines-opm",
    "piano",
    "pop",
    "pop-film",
    "post-dubstep",
    "power-pop",
    "progressive-house",
    "psych-rock",
    "punk",
    "punk-rock",
    "r-n-b",
    "rainy-day",
    "reggae",
    "reggaeton",
    "road-trip",
    "rock",
    "rock-n-roll",
    "rockabilly",
    "romance",
    "sad",
    "salsa",
    "samba",
    "sertanejo",
    "show-tunes",
    "singer-songwriter",
    "ska",
    "sleep",
    "songwriter",
    "soul",
    "soundtracks",
    "spanish",
    "study",
    "summer",
    "swedish",
    "synth-pop",
    "tango",
    "techno",
    "trance",
    "trip-hop",
    "turkish",
    "work-out",
    "world-music"
]

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query')
    const type = searchParams.get('type')
    const offset = Number(searchParams.get('offset')) || 0;
    const navigate = useNavigate();

    const [categories, setCategories] = useState(!query ? staticCategories : null)
    const [input, setInput] = useState('')
    const [update, setUpdate] = useState(0)
    const [recentlyViewed, setRecentlyViewed] = useState(null)
    const [awake, setAwake] = useState(false)

    const [trackData, setTrackData] = useState(null)
    const [artistData, setArtistData] = useState(null)
    const [albumData, setAlbumData] = useState(null)
    const [playlistData, setPlaylistData] = useState(null)
    const [audiobookData, setAudiobookData] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    
    useEffect(() => {
        const searchRequest = async () => {
            if(query) {
                let url = `${import.meta.env.VITE_API_BASE_URL}/spotify/search`;
                
                //attach query params
                if(query && type && offset){
                    url += `?query=${query}&type=${type}&offset=${offset}`
                }
                else if(query && type){
                    url += `?query=${query}&type=${type}`
                }
                else if(query) {
                    url += `?query=${query}`
                }

                const response = await fetch(url, {
                    headers: { 
                        'Content-Type': 'application/json' 
                    }
                })
                if(response.ok) {
                    const data = await response.json();
                    // console.log(data)
                    
                    setCategories(null);
                    setArtistData(data.artists);
                    setAlbumData(data.albums);
                    setTrackData(data.tracks);
                    setPlaylistData(data.playlists);
                    setAudiobookData(data.audiobooks);
                }
            }
        }
        searchRequest()
    }, [query, update])

    useEffect(() => {
        //Check if server is awake
        const awakeStatus = async () => {
            const response = await fetch(`${apiBaseUrl}/users/awake`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok){
                const data = await response.json()
                setAwake(data.status)
            }
        }
        awakeStatus()

        //if user is logged in, display recently viewed
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

    const handleSearch = (event) => {
        event.preventDefault(); 
        setSearchParams({ query: input });
    };

    const handleTypeClick = (type) => {
        if(type === 'all') {
            navigate(`/search/?query=${query}`)
            setUpdate(prev => prev + 1)
        } else {
            navigate(`/search/?query=${query}&type=${type}`)
            setUpdate(prev => prev + 1)
        }
    }

    const handleShowMore = () => {
        navigate(`/search/?query=${query}&type=${type}&offset=${offset + 50}`)
        setUpdate(prev => prev + 1)
    }
    
    return (
        
        <div>
            {!awake ? 
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
            <div>
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

                {/* recently viewed section */}
                {!recentlyViewed && localStorage.getItem('userInfo') && <div className="text-xl">Recent searches</div>}
                {recentlyViewed && recentlyViewed.length > 5 && localStorage.getItem('userInfo') && <Link to='/recent_searches' className='underline text-xl'>Recent searches</Link>}
                {recentlyViewed && recentlyViewed.length <= 5 && recentlyViewed.length > 0 && localStorage.getItem('userInfo') && <div className="text-xl">Recent searches</div>}
                {recentlyViewed && categories &&
                    <div className='flex flex-col'>
                        
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

                {/* category section */}
                {categories && 
                    <div>
                        <div className='text-xl'>Browse all</div>
                        {categories.map((category, index) => {
                            return <CategoryCard key={index} name={category}/>
                        })}
                    </div>
                }

                {/* results section */}
                <div>
                    {!categories && 
                        <div className='flex space-x-2'>
                            <button onClick={() => handleTypeClick('all')} className={`${!type ? 'text-black bg-white' : 'text-white bg-gray-500'} rounded-lg px-3 py-2`}>All</button>
                            <button onClick={() => handleTypeClick('artist')} className={`${type === 'artist' ? 'text-black bg-white' : 'text-white bg-gray-500'} rounded-lg px-3 py-2`}>Artists</button>
                            <button onClick={() => handleTypeClick('album')} className={`${type === 'album' ? 'text-black bg-white' : 'text-white bg-gray-500'} rounded-lg px-3 py-2`}>Albums</button>
                            <button onClick={() => handleTypeClick('track')} className={`${type === 'track' ? 'text-black bg-white' : 'text-white bg-gray-500'} rounded-lg px-3 py-2`}>Songs</button>
                            <button onClick={() => handleTypeClick('playlist')} className={`${type === 'playlist' ? 'text-black bg-white' : 'text-white bg-gray-500'} rounded-lg px-3 py-2`}>Playlists</button>
                            <button onClick={() => handleTypeClick('audiobook')} className={`${type === 'audiobook' ? 'text-black bg-white' : 'text-white bg-gray-500'} rounded-lg px-3 py-2`}>Audiobooks</button>
                        </div>
                    }
                    
                    {trackData && !categories && (type === 'track' || !type ) &&
                        <div>
                            <div className="text-xl">Tracks</div>
                            {trackData.items.map((track, index) => {
                                if(track){
                                    return <Link to={`/track/${track.id}`} key={index}>{track.name}</Link>
                                }
                            })}

                            {!categories && type === 'track' && trackData.total > (offset + 50) &&
                                <button onClick={handleShowMore} className='bg-green-400'>Show more</button>
                            }
                        </div>
                    }
                    
                    {artistData && !categories && (type === 'artist' || !type ) &&
                        <div>
                            <div className="text-xl">Artists</div>
                            {artistData.items.map((artist, index) => {
                                if(artist){
                                    return <ArtistCard key={index} name={artist.name} image={artist.images.length > 0 ? artist.images[0].url : 'default'} id={artist.id}/>
                                }
                            })}

                            {!categories && type === 'artist' && artistData.total > (offset + 50) &&
                                <button onClick={handleShowMore} className='bg-green-400'>Show more</button>
                            }
                        </div>
                    }
                    
                    {albumData && !categories && (type === 'album' || !type ) &&
                        <div>
                            <div className="text-xl">Albums</div>
                            {albumData.items.map((album, index) => {
                                if(album){
                                    return <AlbumCard key={index} name={album.name} artist={album.artists[0].name} image={album.images[0].url} id={album.id}/>
                                }
                            })}

                            {!categories && type === 'album' && albumData.total > (offset + 50) &&
                                <button onClick={handleShowMore} className='bg-green-400'>Show more</button>
                            }
                        </div>
                    }
                    
                    {playlistData && !categories && (type === 'playlist' || !type ) &&
                        <div>
                            <div className="text-xl">Playlists</div>
                            {playlistData.items.map((playlist, index) => {
                                if(playlist && playlist.owner) {
                                    return <PlaylistCard key={index} name={playlist.name} owner={playlist.owner.display_name} image={playlist.images[0].url} id={playlist.id}/>
                                } 
                            })}
                            
                            {!categories && type === 'playlist' && playlistData.total > (offset + 50) &&
                                <button onClick={handleShowMore} className='bg-green-400'>Show more</button>
                            }
                        </div>
                    }
                    
                    {audiobookData && !categories && (type === 'audiobook' || !type ) &&
                        <div>
                            <div className="text-xl">Audiobooks</div>
                            {audiobookData.items.map((audiobook, index) => {
                                if(audiobook && audiobook.name && audiobook.authors.length > 0){
                                    return <AudiobookCard key={index} name={audiobook.name} author={audiobook.authors[0].name} image={audiobook.images[0].url} id={audiobook.id} />
                                }
                            })}

                            {!categories && type === 'audiobook' && audiobookData.total > (offset + 50) &&
                                <button onClick={handleShowMore} className='bg-green-400'>Show more</button>
                            }
                        </div>
                    }
                </div>
            </div>
            }

             
        </div>
    )
}

export default Search