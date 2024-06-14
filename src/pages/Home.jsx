import React, { useEffect, useState } from 'react'
import ArtistCard from '../components/ArtistCard'
import AlbumCard from '../components/AlbumCard'
import PlaylistCard from '../components/PlaylistCard'
import { Link } from 'react-router-dom'

const Home = () => {
    const [popularArtists, setPopularArtists] = useState(null)  
    const [popularAlbums, setPopularAlbums] = useState(null)  
    const [featuredPlaylists, setFeaturedPlaylists] = useState(null)
    const [savedPlaylists, setSavedPlaylists] = useState(null)

    useEffect(() => {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

      const getHomeData = async () => {  
        const response = await fetch(`${apiBaseUrl}/spotify/home`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if(response.ok) {
          const data = await response.json()
          setPopularArtists(data.popular_artists)
          setPopularAlbums(data.popular_albums)
          // setFeaturedPlaylists(data.featured_playlists)
        }
      }
      getHomeData()

      if(localStorage.getItem('userInfo')){
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        const getData = async () => {
          const response = await fetch(`${apiBaseUrl}/profile/get_sub_profile_data`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
          })
          if(response.ok) {
              const data = await response.json()
              setSavedPlaylists(data.saved_playlists)
          }
        }
        getData()
      }
    }, [])

    return (
      <div>

        {/* Saved playlists section */}
        {savedPlaylists && savedPlaylists.length >= 4 && 
          <div>
            <Link to='/saved_playlists' className='text-xl hover:underline'>Saved playlists</Link>
          
            {savedPlaylists.map((item, index) => {
              if(item.type === 'Playlist' && index < 8){
                return <PlaylistCard key={index} name={item.name} id={item.id} image={item.image} owner={item.creator}/>
              } else if(item.type === 'UserPlaylist' && index < 8){
                return <PlaylistCard key={index} name={item.name} id={item.id} image={'default'} owner={item.creator}/>
              }
            })}
          </div>
        }

        <Link to='/popular_artists' className='underline'>Popular artists</Link>
        {popularArtists && 
          popularArtists.map((artist, index) => {
            return <ArtistCard key={index} name={artist.name} image={artist.image} id={artist.id}/>
          })
        }
        <Link to='/popular_albums' className='underline'>Popular albums</Link>
        {popularAlbums && 
          popularAlbums.map((album, index) => {
            return <AlbumCard key={index} name={album.name} artist={album.artist} image={album.image} id={album.id}/>
          })
        }
        <Link to='/featured_playlists' className='underline'>Featured playlists</Link>
        {featuredPlaylists && 
          featuredPlaylists.map((playlist, index) => {
            return <PlaylistCard key={index} name={playlist.name} owner={playlist.owner.display_name} image={playlist.images[0].url} id={playlist.id} />
          })
        }
      </div>
    )
}

export default Home