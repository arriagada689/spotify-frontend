import React from 'react'
import { Link } from 'react-router-dom'

const AlbumCard = ({ name, artist, image, id  }) => {
    
    return (
        <div>
            <Link to={`/album/${id}`}>
                {name}
            </Link>
        </div>
    )
}

export default AlbumCard