import React, { useEffect, useState } from 'react'
import CategoryCard from '../components/CategoryCard.jsx'
import { useSearchParams, Link } from 'react-router-dom';
import ArtistCard from '../components/ArtistCard.jsx';
import { FaSearch } from "react-icons/fa";
import AlbumCard from '../components/AlbumCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';
import AudiobookCard from '../components/AudiobookCard.jsx';

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
    const [categories, setCategories] = useState(staticCategories)
    const [input, setInput] = useState('')
    const [trackData, setTrackData] = useState(null)
    const [artistData, setArtistData] = useState(null)
    const [albumData, setAlbumData] = useState(null)
    const [playlistData, setPlaylistData] = useState(null)
    const [audiobookData, setAudiobookData] = useState(null)

    const query = searchParams.get('query')
    const type = searchParams.get('type')
    const offset = searchParams.get('offset')
    
    useEffect(() => {
        
        const searchRequest = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            if(query && type && offset) {
                const response = await fetch(`${apiBaseUrl}/spotify/search?query=${query}&type=${type}&offset=${offset}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok) {
                    const data = await response.json()
                    if(type === 'artist') {
                        setArtistData(data.artists)
                        setCategories(null)
                    } else if(type === 'album') {
                        setAlbumData(data.albums)
                        setCategories(null)
                    } else if(type === 'track') {
                        setTrackData(data.tracks)
                        setCategories(null)
                    } else if(type === 'playlist') {
                        setPlaylistData(data.playlists)
                        setCategories(null)
                    } else if(type === 'audiobook') {
                        setAudiobookData(data.audiobooks)
                        setCategories(null)
                    } 
                }
            } else if(query && type){
                const response = await fetch(`${apiBaseUrl}/spotify/search?query=${query}&type=${type}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok) {
                    const data = await response.json()
                    if(type === 'artist') {
                        setArtistData(data.artists)
                        setCategories(null)
                    } else if(type === 'album') {
                        setAlbumData(data.albums)
                        setCategories(null)
                    } else if(type === 'track') {
                        setTrackData(data.tracks)
                        setCategories(null)
                    } else if(type === 'playlist') {
                        setPlaylistData(data.playlists)
                        setCategories(null)
                    } else if(type === 'audiobook') {
                        setAudiobookData(data.audiobooks)
                        setCategories(null)
                    } 
                }
            } else if(query) {
                const response = await fetch(`${apiBaseUrl}/spotify/search?query=${query}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok) {
                    const data = await response.json()
                    setCategories(null)
                    setArtistData(data.artists)
                    setAlbumData(data.albums)
                    setTrackData(data.tracks)
                    setPlaylistData(data.playlists)
                    setAudiobookData(data.audiobooks)
                }
            }
        }
        searchRequest()
        
    }, [searchParams])

    const handleSearch = (event) => {
        event.preventDefault(); 
        setSearchParams({ query: input });
    };

    const handleTypeButton = (type) => {
        
        const newParams = new URLSearchParams(searchParams);
        if (type) {
            newParams.set('type', type);
        } else {
            newParams.delete('type');
        }
        setSearchParams(newParams);
    }
    
    return (
        <div>
            {/* search bar here */}
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit"><FaSearch /></button>
            </form>
            {!categories && 
                <div className='flex space-x-2'>
                    <button className={`${!type ? 'text-black bg-white' : 'text-white bg-gray-500'} rounded-lg px-3 py-2`} onClick={() => handleTypeButton('')} >All</button>
                    <button className={`${type === 'artist' ? 'text-black bg-white' : 'text-white bg-gray-500'} rounded-lg px-3 py-2`} onClick={() => handleTypeButton('artist')}>Artists</button>
                    <button className={`${type === 'album' ? 'text-black bg-white' : 'text-white bg-gray-500'} rounded-lg px-3 py-2`} onClick={() => handleTypeButton('album')}>Albums</button>
                    <button className={`${type === 'track' ? 'text-black bg-white' : 'text-white bg-gray-500'} rounded-lg px-3 py-2`} onClick={() => handleTypeButton('track')}>Songs</button>
                    <button className={`${type === 'playlist' ? 'text-black bg-white' : 'text-white bg-gray-500'} rounded-lg px-3 py-2`} onClick={() => handleTypeButton('playlist')}>Playlists</button>
                    <button className={`${type === 'audiobook' ? 'text-black bg-white' : 'text-white bg-gray-500'} rounded-lg px-3 py-2`} onClick={() => handleTypeButton('audiobook')}>Audiobooks</button>
                </div>
            }
            
            {categories && 
                <div>
                    <div className='text-xl'>Browse all</div>
                    {categories.map((category, index) => {
                        return <CategoryCard key={index} name={category}/>
                    })}
                </div>
            }
            
            {trackData && !categories && (type === 'track' || !type ) &&
                <div>
                    <div className="text-xl">Tracks</div>
                    {trackData.map((track, index) => {
                        return <Link to={`/track/${track.id}`} key={index}>{track.name}</Link>
                    })}
                </div>
            }
            
            {artistData && !categories && (type === 'artist' || !type ) &&
                <div>
                    <div className="text-xl">Artists</div>
                    {artistData.map((artist, index) => {
                        return <ArtistCard key={index} name={artist.name} image={artist.images.length > 0 ? artist.images[0].url : 'default'} id={artist.id}/>
                    })}
                </div>
            }
            
            {albumData && !categories && (type === 'album' || !type ) &&
                <div>
                    <div className="text-xl">Albums</div>
                    {albumData.map((album, index) => {
                        return <AlbumCard key={index} name={album.name} artist={album.artists[0].name} image={album.images[0].url} id={album.id}/>
                    })}
                </div>
                
            }
            
            {playlistData && !categories && (type === 'playlist' || !type ) &&
                <div>
                    <div className="text-xl">Playlists</div>
                    {playlistData.map((playlist, index) => {
                        return <PlaylistCard key={index} name={playlist.name} owner={playlist.owner.display_name} image={playlist.images[0].url} id={playlist.id}/> 
                    })}
                </div>
                
            }
            
            {audiobookData && !categories && (type === 'audiobook' || !type ) &&
                <div>
                    <div className="text-xl">Audiobooks</div>
                    {audiobookData.map((audiobook, index) => {
                        return <AudiobookCard key={index} name={audiobook.name} author={audiobook.authors[0].name} image={audiobook.images[0].url} id={audiobook.id} />
                    })}
                </div>
                
            }
        </div>
    )
}

export default Search