import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider 
} from 'react-router-dom'
import Home from './pages/Home.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import PopularArtists from './pages/PopularArtists.jsx'
import PopularAlbums from './pages/PopularAlbums.jsx'
import FeaturedPlaylists from './pages/FeaturedPlaylists.jsx'
import Search from './pages/Search.jsx'
import TrackPage from './pages/TrackPage.jsx'
import ArtistPage from './pages/ArtistPage.jsx'
import AlbumPage from './pages/AlbumPage.jsx'
import PlaylistPage from './pages/PlaylistPage.jsx'
import AudiobookPage from './pages/AudiobookPage.jsx'
import UserPage from './pages/UserPage.jsx'
import CreatePlaylist from './pages/CreatePlaylist.jsx'
import UserPlaylistPage from './pages/UserPlaylistPage.jsx'
import UpdatePlaylist from './pages/UpdatePlaylist.jsx'
import ConfirmPlaylistDelete from './pages/ConfirmPlaylistDelete.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<Home />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<SignUp />}/>
      <Route path='/signup' element={<SignUp />}/>
      <Route path='/popular_artists' element={<PopularArtists />}/>
      <Route path='/popular_albums' element={<PopularAlbums />}/>
      <Route path='/featured_playlists' element={<FeaturedPlaylists />}/>
      <Route path='/search' element={<Search />}/>
      <Route path='/track/:id' element={<TrackPage />}/>
      <Route path='/artist/:id' element={<ArtistPage />}/>
      <Route path='/album/:id' element={<AlbumPage />}/>
      <Route path='/playlist/:id' element={<PlaylistPage />}/>
      <Route path='/audiobook/:id' element={<AudiobookPage />}/>
      <Route path='/user/:id' element={<UserPage />}/>
      <Route path='/create_playlist' element={<CreatePlaylist />}/>
      <Route path='/update_playlist/:id' element={<UpdatePlaylist />}/>
      <Route path='/user_playlist/:id' element={<UserPlaylistPage />}/>
      <Route path='/confirm_playlist_delete/:id' element={<ConfirmPlaylistDelete />}/>
    </Route>
  )
)

function App() {
  
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
