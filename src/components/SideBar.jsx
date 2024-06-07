import React from 'react'
import { Link } from 'react-router-dom'

const SideBar = () => {
    return (
        <div className='fixed h-[60px] w-full bottom-0 md:top-0 md:left-0 md:h-full md:w-[375px] border md:m-1'>
            <div className="flex flex-row md:flex-col">
                <Link to='/'>Home</Link>
                <Link to='/search'>Search</Link>
            </div>
        </div>
    )
}

export default SideBar