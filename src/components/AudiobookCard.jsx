import React from 'react'
import { Link } from 'react-router-dom'

const AudiobookCard = ({ name, author, image, id }) => {
  return (
    <div>
      <Link to={`/audiobook/${id}`}> 
        {name}
      </Link>
    </div>
  )
}

export default AudiobookCard