import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import spotifyImage from '../assets/spotify_default2.jpg';
import likedSongsImage from '../assets/liked-songs.png';
import PlaylistCard from '../components/PlaylistCard';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';
import AudiobookCard from '../components/AudiobookCard';
import { Oval } from 'react-loader-spinner'

const Profile = () => {
    const [profileData, setProfileData] = useState(null)
    const [likedSongs, setLikedSongs] = useState(null)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        const getProfileData = async () => {
            const response = await fetch(`${apiBaseUrl}/profile/get_profile`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok) {
                const data = await response.json()
                setProfileData(data)
                // console.log(data)
            }
        }
        getProfileData()

        //get liked songs data
        const getLikedSongsData = async () => {
            const response = await fetch(`${apiBaseUrl}/profile/liked_songs`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok){
                const data = await response.json()
                setLikedSongs(data.liked_songs)
            }
        }
        getLikedSongsData()
    }, [])
    
    return profileData ? (
        <div className='bg-primary flex flex-col px-5 pb-16 md:pb-2 h-fit pt-3 md:pt-0 space-y-4'>
            <div className='flex flex-col md:flex-row items-center'>
                <img src={spotifyImage} alt='default image' className='h-[270px] w-[270px] rounded-full mx-auto md:mx-0'/>
                <div className="flex flex-col text-white space-y-4 md:ml-4 mt-2 md:mt-0 w-full">
                    <div>Profile</div>
                    <div className='text-4xl md:text-7xl font-bold name-width truncate pb-2 md:pb-4'>{profileData.username}</div>
                    <div className='text-grayText'>{ `${profileData.artist_count} artist(s), ${profileData.album_count} album(s), ${profileData.playlist_count} playlist(s), ${profileData.audiobook_count} audiobook(s)` }</div>
                </div>
            </div>

            {/* update profile and delete profile links */}
            <div className="flex items-center space-x-3">
                <Link to='/update_profile' className='bg-spotifyGreen w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Update profile</Link>
                <Link to='/confirm_delete_profile' className='bg-red-500 w-fit font-semibold py-2 px-3 text-xl rounded-2xl'>Delete profile</Link>
            </div>

            <div className='space-y-4'>

                {/* Saved Playlists section */}
                {(profileData && profileData.saved_playlists.length > 0) || likedSongs && likedSongs.length > 0 &&
                    <div>
                        <div className='text-2xl text-white font-bold'>Saved playlists</div>

                        <div className="flex overflow-y-auto custom-scrollbar">
                            {likedSongs && likedSongs.length > 0 && 
                                <Link to={'/liked_songs'}>
                                    <div className='flex flex-col w-[180px] md:w-[200px] bg-primary hover:bg-hoverGray rounded-lg pt-2'>
                                        <img src={likedSongsImage} alt={'Liked Songs'} className='rounded-md w-[160px] md:w-[180px] h-[160px] md:h-[180px] self-center'/>
                                        <div className="flex flex-col p-2">
                                            <div className='text-white truncate'>Liked Songs</div>
                                            <div className='text-grayText text-sm truncate'>{JSON.parse(localStorage.getItem('userInfo')).username}</div>
                                        </div>
                                    </div>
                                </Link>
                            }
                            {profileData.saved_playlists.map((item, index) => {
                                if(item.type === 'Playlist'){
                                    return <PlaylistCard key={index} name={item.name} id={item.id} image={item.image} owner={item.creator} type={item.type}/>
                                } else if(item.type === 'UserPlaylist'){
                                    return <PlaylistCard key={index} name={item.name} id={item._id} image={'default'} owner={item.creator} type={item.type}/>
                                }
                            })} 
                        </div>
                    </div>
                }

                {/* Followed artists section */}
                {profileData && profileData.followed_artists.length > 0 &&
                    <div>
                        <div className='text-2xl text-white font-bold'>Followed artists</div>
                        
                        <div className="flex overflow-y-auto custom-scrollbar">
                            {profileData.followed_artists.map((item, index) => {
                                return <ArtistCard key={index} name={item.name} id={item.id} image={item.image}/>
                            })}
                        </div>
                    </div>
                }

                {/* Followed albums section */}
                {profileData && profileData.followed_albums.length > 0 &&
                    <div>
                        <div className='text-2xl text-white font-bold'>Followed albums</div>

                        <div className="flex overflow-y-auto custom-scrollbar">
                            {profileData.followed_albums.map((item, index) => {
                                return <AlbumCard key={index} name={item.name} id={item.id} image={item.image} artist={item.artist}/>
                            })}
                        </div>
                    </div>
                }

                {/* Followed audiobooks section */}
                {profileData && profileData.followed_audiobooks.length > 0 &&
                    <div>
                        <div className='text-2xl text-white font-bold'>Followed albums</div>

                        <div className="flex overflow-y-auto custom-scrollbar">
                            {profileData.followed_audiobooks.map((item, index) => {
                                return <AudiobookCard key={index} name={item.name} id={item.id} image={item.image} author={item.author}/>
                            })}
                        </div>
                    </div>
                }
            </div>

        </div>) :
        (
            <div className='bg-primary h-dvh flex justify-center'>
                <div className='flex justify-center mt-4'>
                    <Oval
                    visible={true}
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    />
                </div>
            </div>
        )
    
}

export default Profile