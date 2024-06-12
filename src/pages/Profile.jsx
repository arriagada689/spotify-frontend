import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import spotifyImage from '../assets/spotify_default2.jpg';
import PlaylistCard from '../components/PlaylistCard';

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
    
    return (
        <div>
            <img src={spotifyImage} alt='default image' />
            <div>Profile</div>
            {profileData && <div>{profileData.username}</div>}
            {profileData && <div>{ `${profileData.artist_count} artist(s), ${profileData.album_count} album(s), ${profileData.playlist_count} playlist(s), ${profileData.audiobook_count} audiobook(s)` }</div>}

            {/* update profile and delete profile links */}
            <Link to='/update_profile' className='bg-green-400'>Update profile</Link>
            <Link to='/confirm_delete_profile' className='bg-red-400'>Delete profile</Link>

            {profileData && profileData.saved_playlists.length > 0 &&
                <div>
                    <div className="text-xl">Saved playlists</div>

                    {profileData.saved_playlists.map((item, index) => {
                        if(item.type === 'Playlist'){
                            return <PlaylistCard key={index} name={item.name} id={item.id} image={item.image} owner={item.creator}/>
                        } else if(item.type === 'UserPlaylist'){
                            return <PlaylistCard key={index} name={item.name} id={item.id} image={'default'} owner={item.creator}/>
                        }
                    })}
                </div>
            }
        </div>
    )
}

export default Profile