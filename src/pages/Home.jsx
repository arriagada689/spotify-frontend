import React, { useEffect, useState } from 'react'
import ArtistCard from '../components/ArtistCard'
import AlbumCard from '../components/AlbumCard'
import PlaylistCard from '../components/PlaylistCard'
import MiniCard from '../components/MiniCard'
import { Link } from 'react-router-dom'
import { Oval } from 'react-loader-spinner'

const Home = () => {
    const [popularArtists, setPopularArtists] = useState(null)  
    const [popularAlbums, setPopularAlbums] = useState(null)  
    const [featuredPlaylists, setFeaturedPlaylists] = useState(null)
    const [savedPlaylists, setSavedPlaylists] = useState(null)

    useEffect(() => {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

      const getHomeData = async () => {  
        try {
          const response = await fetch(`${apiBaseUrl}/spotify/home`, {
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          if (response.ok) {
              const data = await response.json();
              setPopularArtists(data.popular_artists);
              setPopularAlbums(data.popular_albums);
              setFeaturedPlaylists(data.featured_playlists);
          } else {
              const errorData = await response.json();  
              throw new Error(errorData.message || "Error fetching data");
          }
        } catch (error) {
            
            console.error("Network error or JSON parsing error:", error.message);
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
      <div className='flex flex-col bg-primary px-5 space-y-5 pb-16 md:pb-0'>

        {/* Saved playlists section */}
        <div className='mt-3 md:mt-0'>
          {savedPlaylists && savedPlaylists.length >= 4 &&
            <div className='flex justify-between items-baseline mb-2'>
              <Link to='/saved_playlists' className='text-2xl text-white font-bold underline md:no-underline md:hover:underline'>Saved playlists</Link>
              <Link to='/saved_playlists' className='text-grayText underline md:no-underline md:hover:underline font-semibold '>Show all</Link>
            </div>
            
          }
          {savedPlaylists && savedPlaylists.length < 4 &&
            <div className='flex justify-between items-baseline mb-2'>
              <div className='text-2xl text-white font-bold'>Saved playlists</div>
            </div>
          }
          {savedPlaylists &&  
            <div className='grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4'>
              {savedPlaylists.map((item, index) => {
                if(item){
                  if(item.type === 'Playlist' && index < 8){
                    return <MiniCard key={index} name={item.name} id={item.id} image={item.image} type={item.type}/>
                  } else if(item.type === 'UserPlaylist' && index < 8){
                    return <MiniCard key={index} name={item.name} id={item._id} image={'default'} type={item.type}/>
                  }
                }
              })}
            </div>
          }
        </div>

        {/* Popular artists section */}
        <div className='w-full'>
          <div className='flex justify-between items-baseline mb-2'>
            <Link to='/popular_artists' className='text-2xl text-white font-bold underline md:no-underline md:hover:underline'>Popular artists</Link>
            <Link to='/popular_artists' className='text-grayText underline md:no-underline md:hover:underline font-semibold '>Show all</Link>
          </div>
          <div className='flex w-full overflow-x-auto md:overflow-hidden'>
            {popularArtists && 
              popularArtists.map((artist, index) => {
                return <ArtistCard key={index} name={artist.name} image={artist.image} id={artist.id}/>
              })
            }
            {!popularArtists && 
              <div className='flex mx-auto'>
                <Oval
                visible={true}
                height="220"
                width="180"
                color="#4fa94d"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                />
              </div>
            }
          </div>
        </div>

        {/* Popular albums section */}
        <div className='w-full'>
          <div className='flex justify-between items-baseline mb-2'>
            <Link to='/popular_albums' className='text-2xl text-white font-bold underline md:no-underline md:hover:underline'>Popular albums</Link>
            <Link to='/popular_albums' className='text-grayText underline md:no-underline md:hover:underline font-semibold '>Show all</Link>
          </div>
          <div className='flex w-full overflow-x-auto md:overflow-hidden'>
            {popularAlbums && 
              popularAlbums.map((album, index) => {
                return <AlbumCard key={index} name={album.name} artist={album.artist} image={album.image} id={album.id}/>
              })
            }
            {!popularAlbums && 
              <div className='flex mx-auto'>
                <Oval
                visible={true}
                height="220"
                width="180"
                color="#4fa94d"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                />
              </div>
            }
          </div>
        </div>

        {/* Featured artists section */}
        <div className='w-full '>
          <div className='flex justify-between items-baseline mb-2'>
            <Link to='/featured_playlists' className='text-2xl text-white font-bold underline md:no-underline md:hover:underline'>Featured playlists</Link>
            <Link to='/featured_playlists' className='text-grayText underline md:no-underline md:hover:underline font-semibold '>Show all</Link>
          </div>
          <div className='flex w-full overflow-x-auto md:overflow-hidden'>
            {featuredPlaylists && 
              featuredPlaylists.map((playlist, index) => {
                return <PlaylistCard key={index} name={playlist.name} owner={playlist.owner.display_name} image={playlist.images[0].url} id={playlist.id} type={'Playlist'}/>
              })
            }
            {!featuredPlaylists && 
            <div className='flex mx-auto'>
              <Oval
              visible={true}
              height="220"
              width="180"
              color="#4fa94d"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
              />
            </div>
            }
          </div>
        </div>
      </div>
    )
}

export default Home