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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<Home />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<Login />}/>
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
