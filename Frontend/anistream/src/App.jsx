// import './App.css'
import {Routes,Route} from 'react-router-dom'
import Nav from './Components/Navbar/Nav'
import Wishlist from './Components/WishList/Wishlist'
import Register_Series from './Pages/New/Resgister_Series'
import View from './Pages/Anime_View/View'
import Episode from './Pages/Episode/Episode'
import Signup from './Pages/Auth/SignUp/Signup'
import Home from './Pages/Home/Home'
import Genres from './Pages/Genres/Genres'
import {Provider} from 'react-redux'

import Login from './Pages/Auth/Login/Login'
import Dashboard from './Pages/Dashboard/Dashboard'
import { store } from './Redux/store'
import ProtectedRoutes from './Components/ProtectedRoute/ProtectedRoutes'
import Edit from './Components/Anime_list/New/Edit'
import { ToastContainer } from 'react-toastify'
import PrivateRoutes from './Components/ProtectedRoute/PrivateRoutes'
import Results from './Components/Results/Results'
import Resgister_Series from './Pages/New/Resgister_Series'
function App() {
  return (
    <div className='bg-gradient-to-b from-[#160037] via-[#4A1F80] via-[#420088] to-[#390059] min-h-screen w-full' >
      <ToastContainer/>
      <Provider store={store}>
      <Nav/>
      <Routes>
        <Route path="/login" element={<Login/> } />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/" element={<ProtectedRoutes><Home /> </ProtectedRoutes>} />
        <Route path="/genres" element={<ProtectedRoutes><Genres/></ProtectedRoutes>} />
        <Route path="/new" element={<PrivateRoutes><Resgister_Series/></PrivateRoutes>} />
        <Route path="/edit" element={<PrivateRoutes><Edit/></PrivateRoutes>} />
        <Route path="/view" element={<View/>} />
        <Route path="/episode-view" element={<Episode/>} />
        <Route path="/wishlist" element={<Wishlist/>} />
        <Route path="/results" element={<Results/>} />
      </Routes>
      </Provider>
      </div>
  )
}

export default App
