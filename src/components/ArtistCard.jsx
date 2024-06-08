import React from 'react'
import { Link } from 'react-router-dom'

const ArtistCard = ({ name, image, id }) => {
    
    return (
        <div>
            <Link to={`/artist/${id}`}>
                {name}
            </Link>
        </div>
    )
}

export default ArtistCard