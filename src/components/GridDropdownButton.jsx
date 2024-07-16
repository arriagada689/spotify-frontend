import React from 'react'
import { FaListUl } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";

const GridDropdownButton = ({ gridDropdown, gridView, setGridDropdown, setGridView }) => {
    
    const handleDropdownClick = (action) => {
        setGridView(action)
        setGridDropdown(false)
    }
    
    return (
        <div className='text-grayText relative'>
            {/*Grid view button*/}
            {gridView === 'List' ? (
                <button onClick={(e) => setGridDropdown(prev => !prev)} className='flex items-center'>
                    <div className='mr-2'>List</div>
                    <FaListUl size={17}/>
                </button>
            ) : (
                <button onClick={(e) => setGridDropdown(prev => !prev)} className='flex items-center'>
                    <div className='mr-2'>Compact</div>
                    <GiHamburgerMenu size={17}/>
                </button>
            )}

            {/*dropdown */}
            {gridDropdown &&
                <div className='absolute right-0 mt-2 -ml-10 bg-grayBox shadow-lg flex flex-col w-40 p-3 gap-y-2 rounded-lg'>
                    <div className='text-sm'>View as</div>
                    <button onClick={() => handleDropdownClick('Compact')} className={`flex justify-between items-center w-full ${gridView === 'Compact' ? 'text-spotifyGreen' : ''}`}>
                        <span className='flex items-center w-full'>
                            <GiHamburgerMenu size={20}/>
                            <div className='ml-2'>Compact</div>
                        </span>
                        {gridView === 'Compact' && <IoMdCheckmark />}
                    </button>

                    <button onClick={() => handleDropdownClick('List')} className={`flex justify-between items-center w-full ${gridView === 'List' ? 'text-spotifyGreen' : ''}`}>
                        <span className='flex items-center w-full'>
                            <FaListUl size={20}/>
                            <div className='ml-2'>List</div>
                        </span>
                        {gridView === 'List' && <IoMdCheckmark size={20}/>}
                    </button>
                </div>
            }
        </div>
    )
}

export default GridDropdownButton