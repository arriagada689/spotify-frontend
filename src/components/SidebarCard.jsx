import React from 'react'
import spotifyImage from '../assets/spotify_default2.jpg';
import { Link } from 'react-router-dom';
import lowercaseFirstLetter from '../utils/lowercaseFirstLetter';

const SidebarCard = ({name, id, type, subname, image}) => {

    return (
        <Link to={`/${type === 'UserPlaylist' ? 'user_playlist' : lowercaseFirstLetter(type)}/${id}`} className='flex p-2 hover:bg-hoverGray space-x-2 rounded-sm w-full'>
            <img src={image !== 'default' ? image : spotifyImage} alt={name} className='h-[50px] w-[50px] rounded-md'/>
            <div className='flex flex-col my-auto'>
                <div className='text-white line-clamp-1'>{name}</div>
                <div className='text-sm line-clamp-1'>{type} - {subname}</div>
            </div>
        </Link>
    )
}

export default SidebarCard