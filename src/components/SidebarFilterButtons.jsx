import React from 'react'
import { IoMdClose } from "react-icons/io";

const SidebarFilterButtons = ({ handleTypeClick, type, arr }) => {
    
    return (
        <div>
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
        </div>
    )
}

export default SidebarFilterButtons