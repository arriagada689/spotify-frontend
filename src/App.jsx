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
