import React from 'react'
import { Link } from 'react-router-dom'

const PlaylistCard = ({ name, owner, image, id }) => {
    
    return (
        <div>
            <Link to={`/playlist/${id}`}>
                {name}
            </Link>
        </div>
    )
}

export default PlaylistCard