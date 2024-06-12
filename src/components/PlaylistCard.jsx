import React from 'react'
import { Link } from 'react-router-dom'

const PlaylistCard = ({ name, owner, image, id }) => {
    
    //Handle default image for profile page when displaying user playlists

    return (
        <div>
            <Link to={`/playlist/${id}`}>
                {name}
            </Link>
        </div>
    )
}

export default PlaylistCard