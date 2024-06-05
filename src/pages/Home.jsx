import React, { useEffect, useState } from 'react'

const Home = () => {
    const [popularArtists, setPopularArtists] = useState(null)  
    const [popularAlbums, setPopularAlbums] = useState(null)  
    const [featuredPlaylists, setFeaturedPlaylists] = useState(null)  

    useEffect(() => {
      const getHomeData = async () => {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
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
    }, [])

    return (
      <div>
        <div className='underline'>Popular Artists</div>
        {popularArtists && 
          popularArtists.map((artist, index) => {
            return <div>{artist.name}</div>
          })
        }
        <div className='underline'>Popular Albums</div>
        {popularAlbums && 
          popularAlbums.map((album, index) => {
            return <div>{album.name}</div>
          })
        }
        <div className='underline'>Featured Playlists</div>
        {featuredPlaylists && 
          featuredPlaylists.map((playlist, index) => {
            return <div>{playlist.name}</div>
          })
        }
      </div>
    )
}

export default Home