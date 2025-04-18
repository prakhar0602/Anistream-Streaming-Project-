// import './App.css'
import {Routes,Route} from 'react-router-dom'
import Nav from './Components/Navbar/Nav'
import Wishlist from './Components/WishList/Wishlist'
import View from './Pages/Anime_View/View'
import Episode from './Pages/Episode/Episode'
import Signup from './Pages/Auth/Signup'
import Home from './Pages/Home/Home'
import Genres from './Pages/Genres/Genres'
import {Provider} from 'react-redux'

import Login from './Pages/Auth/Login'
import { store } from './Redux/store'
import ProtectedRoutes from './Components/ProtectedRoute/ProtectedRoutes'
import Edit from './Components/Anime_list/New/Edit'
import PrivateRoutes from './Components/ProtectedRoute/PrivateRoutes'
import Results from './Components/Results/Results'
import Resgister_Series from './Pages/New/Upload'
import { useState } from 'react'
import New from './Pages/New/New'
import Upload from './Pages/New/Upload'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
function App() {
  return (
    <div className='bg-[#0F1014] min-h-screen h-full w-full font-funky tracking-widest ' >
      
      <Provider store={store}>
        <ToastContainer 
          position="top-center"
          autoClose={3000}
        />
      <Nav />
      <div className='ml-[100px]'>

      <Routes >
        <Route path="/login" element={<PrivateRoutes><Login /></PrivateRoutes> } />
        <Route path="/signup" element={<PrivateRoutes><Signup/></PrivateRoutes>}/>
        <Route path="/" element={<Home />} />
        <Route path="/genres" element={<ProtectedRoutes><Genres/></ProtectedRoutes>} />
        <Route path="/upload" element={<ProtectedRoutes><New/></ProtectedRoutes>} />
        <Route path="/upload/:type" element={<ProtectedRoutes><Upload/></ProtectedRoutes>} />
        <Route path="/edit" element={<ProtectedRoutes><Edit/></ProtectedRoutes>} />
        <Route path="/view" element={<ProtectedRoutes><View/></ProtectedRoutes>} />
        <Route path="/episode-view" element={<ProtectedRoutes><Episode/></ProtectedRoutes>} />
        <Route path="/wishlist" element={<ProtectedRoutes><Wishlist/></ProtectedRoutes>} />
        <Route path="/results" element={<Results/>} />

        {/* <Route path="/login" element={<Login/> } />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/" element={<ProtectedRoutes><Home /> </ProtectedRoutes>} />
        <Route path="/genres" element={<ProtectedRoutes><Genres/></ProtectedRoutes>} />
        <Route path="/new" element={<PrivateRoutes><Resgister_Series/></PrivateRoutes>} />
        <Route path="/edit" element={<PrivateRoutes><Edit/></PrivateRoutes>} />
        <Route path="/view" element={<View/>} />
        <Route path="/episode-view" element={<Episode/>} />
        <Route path="/wishlist" element={<Wishlist/>} />
        <Route path="/results" element={<Results/>} /> */}
      </Routes>
        </div>
      </Provider>
      </div>
  )
}

export default App
