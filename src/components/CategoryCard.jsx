import React from 'react'
import { Link } from 'react-router-dom'

const CategoryCard = ({ name }) => {
    return (
        <Link to={`/search?query=${name}`}>
            <div>{name}</div>
        </Link>
    )
}

export default CategoryCard