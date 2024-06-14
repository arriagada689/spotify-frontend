import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import spotifyImage from '../assets/spotify_default2.jpg';
import PlaylistCard from '../components/PlaylistCard';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';
import AudiobookCard from '../components/AudiobookCard';
import { Oval } from 'react-loader-spinner'

const Profile = () => {
    const [profileData, setProfileData] = useState(null)
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
    }, [])
    
    return profileData ? (
        <div>
            <img src={spotifyImage} alt='default image' />
            <div>Profile</div>
            {profileData && <div>{profileData.username}</div>}
            {profileData && <div>{ `${profileData.artist_count} artist(s), ${profileData.album_count} album(s), ${profileData.playlist_count} playlist(s), ${profileData.audiobook_count} audiobook(s)` }</div>}

            {/* update profile and delete profile links */}
            <Link to='/update_profile' className='bg-green-400'>Update profile</Link>
            <Link to='/confirm_delete_profile' className='bg-red-400'>Delete profile</Link>

            {/* Saved Playlists section */}
            {profileData && profileData.saved_playlists.length > 0 &&
                <div>
                    {profileData.saved_playlists.length >= 4 ? 
                        <Link to='/saved_playlists' className='text-xl hover:underline'>Saved playlists</Link> :
                        <div className='text-xl'>Saved playlists</div>
                    }

                    {profileData.saved_playlists.map((item, index) => {
                        if(item.type === 'Playlist'){
                            return <PlaylistCard key={index} name={item.name} id={item.id} image={item.image} owner={item.creator}/>
                        } else if(item.type === 'UserPlaylist'){
                            return <PlaylistCard key={index} name={item.name} id={item.id} image={'default'} owner={item.creator}/>
                        }
                    })}
                </div>
            }

            {/* Followed artists section */}
            {profileData && profileData.followed_artists.length > 0 &&
                <div>
                    {profileData.followed_artists.length >= 4 ? 
                        <Link to='/followed_artists' className='text-xl hover:underline'>Followed artists</Link> :
                        <div className='text-xl'>Followed artists</div>
                    }
                    {profileData.followed_artists.map((item, index) => {
                        return <ArtistCard key={index} name={item.name} id={item.id} image={item.image}/>
                    })}
                </div>
            }

            {/* Followed albums section */}
            {profileData && profileData.followed_albums.length > 0 &&
                <div>
                    {profileData.followed_albums.length >= 4 ? 
                        <Link to='/followed_albums' className='text-xl hover:underline'>Followed albums</Link> :
                        <div className='text-xl'>Followed albums</div>
                    }
                    {profileData.followed_albums.map((item, index) => {
                        return <AlbumCard key={index} name={item.name} id={item.id} image={item.image} artist={item.artist}/>
                    })}
                </div>
            }

            {/* Followed audiobooks section */}
            {profileData && profileData.followed_audiobooks.length > 0 &&
                <div>
                    {profileData.followed_audiobooks.length >= 4 ? 
                        <Link to='/followed_audiobooks' className='text-xl hover:underline'>Followed audiobooks</Link> :
                        <div className='text-xl'>Followed audiobooks</div>
                    }
                    {profileData.followed_audiobooks.map((item, index) => {
                        return <AudiobookCard key={index} name={item.name} id={item.id} image={item.image} author={item.author}/>
                    })}
                </div>
            }

        </div>) :
        (
            <div>
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
        )
    
}

export default Profile