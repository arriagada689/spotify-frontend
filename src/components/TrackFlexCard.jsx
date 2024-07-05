import React, { useState } from 'react'
import formatDuration from '../utils/formatDuration'
import { Link } from 'react-router-dom'
import { FiPlusCircle } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

const TrackFlexCard = ({popular_track, index}) => {

    return (
        <Link to={`/track/${popular_track.id}`} key={index}>
            <div className='flex w-full bg-primary hover:bg-hoverGray items-center p-2 rounded-md parent'>
                <img src={popular_track.album.images[0].url} alt={popular_track.name} className='h-[45px] w-[45px] rounded-md'/>
                <div className='flex w-full justify-between ml-2 items-center'>
                    <div className='flex flex-col'>
                        <div className='text-white'>{popular_track.name}</div>
                        <div className='text-grayText text-sm'>{popular_track.artists[0].name}</div>
                    </div>

                    <div className='flex items-center text-grayText space-x-3'>
                        <FiPlusCircle className='hover-show' />
                        <div className=''>{formatDuration(popular_track.duration_ms)}</div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default TrackFlexCard