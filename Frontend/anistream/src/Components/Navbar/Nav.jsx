import React, { useEffect, useState } from "react";
import logo from "../../Assets/icon.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logout } from "../../Redux/userSlice";
import { toast } from "react-toastify";
import axios from "axios";
const { VITE_BACKEND_LINK } = import.meta.env;
const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoggedIn, userProfile, loading } = useSelector(state => state.user);
  

  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  function changeURL(l) {
    navigate(l);
  }
  async function logout1() {
    try {
      await axios.get(`${VITE_BACKEND_LINK}/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      // Error handled
    }
    dispatch(logout());
    navigate('/login');
  }
  async function search() {
    if (!query.trim()) {
      toast.warning("Please enter a search term", { position: "bottom-right" });
      return;
    }
    
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }
  return (

    <nav className="w-[100px] bg-[#0F1014]">
    <div className={`${menuOpen?("w-[250px] bg-gradient-to-r from-[#0F1014] via-[#0F1015] to-[#0f101411]"):("w-[100px] bg-[#0F1014]")} flex flex-col  h-screen fixed z-40 justify-between py-5 transition-all duration-500 ease-in-out `} onMouseEnter={()=>setMenuOpen(true)} onMouseLeave={()=>setMenuOpen(false)}>
      <div className="w-[100px] flex justify-center">
        <img className="h-16" src={logo} alt="Icon" />
      </div>
      <div className="flex text-[#8f8f8f]">
        <ul className="flex flex-col text-2xl gap-5">
          <li>
            <button onClick={()=>changeURL("/")} >
            <div className="flex gap-5 hover:text-white">
              <p className="  w-[100px] text-center">
                <ion-icon name="home"></ion-icon>
              </p>
              <p className={`  ${menuOpen?("ml-0 opacity-100"):("-ml-14 opacity-0")}  transition-margin transition-opacity duration-500 ease-in-out`}>Home</p>
            </div>
            </button>
          </li>
          <li>
            <button onClick={()=>changeURL("/genres")} >
              <div className="flex gap-5 hover:text-white">
              <p className="  w-[100px] text-center">
                <ion-icon name="logo-octocat"></ion-icon>
              </p>
                <p className={`  ${menuOpen?("ml-0 opacity-100"):("-ml-14 opacity-0")}  transition-margin transition-opacity duration-500 ease-in-out`}>Genre</p>
              </div>
            </button>
          </li>
          <li>
            <button onClick={()=>changeURL("/search")}>
            <div className="flex gap-5 hover:text-white">
              <p className="  w-[100px] text-center">
                <ion-icon name="search"></ion-icon>
              </p>
                <p className={`  ${menuOpen?("ml-0 opacity-100"):("-ml-14 opacity-0")}  transition-margin transition-opacity duration-500 ease-in-out`}>Search</p>
            </div>
            </button>
          </li>
          <li>
            <button onClick={()=>changeURL("/series")}>
            <div className="flex gap-5 hover:text-white">
              <p className="  w-[100px] text-center">
                <ion-icon name="tv"></ion-icon>
              </p>
                <p className={`  ${menuOpen?("ml-0 opacity-100"):("-ml-14 opacity-0")}  transition-margin transition-opacity duration-500 ease-in-out`}>Series</p>
            </div>
            </button>
          </li>
          <li>
            <button onClick={()=>changeURL("/movies")} >
              <div className="flex gap-5 hover:text-white">
              <p className="  w-[100px] text-center">
                <ion-icon name="videocam"></ion-icon>
              </p>
                <p className={`  ${menuOpen?("ml-0 opacity-100"):("-ml-14 opacity-0")}  transition-margin transition-opacity duration-500 ease-in-out`}>Movies</p>
              </div>
            </button>
          </li>
          {
            user && (user.type==="admin" || user.type==="cc")?(
            <li>
            <button onClick={()=>changeURL("/upload")} >
              <div className="flex gap-5 hover:text-white">
              <p className="  w-[100px] text-center">
              <ion-icon name="add-circle"></ion-icon>
              </p>
                <p className={`  ${menuOpen?("ml-0 opacity-100"):("-ml-14 opacity-0")}  transition-margin transition-opacity duration-500 ease-in-out`}>Add</p>
              </div>
            </button>
          </li>):(<></>)
          }
        </ul>
      </div>
      <div className="text-2xl flex text-[#8f8f8f] relative">
        {isLoggedIn?.bool ? (
          <div className="relative">
            <div 
              className="flex gap-5 hover:text-white cursor-pointer"
              onClick={() => setProfileDropdown(!profileDropdown)}
            >
              <div className="w-[100px] flex justify-center">
                {userProfile?.profile_image ? (
                  <img 
                    src={userProfile.profile_image} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-600 hover:border-white transition-colors"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-8 h-8 rounded-full border-2 border-gray-600 hover:border-white transition-colors bg-gray-600 flex items-center justify-center text-sm ${userProfile?.profile_image ? 'hidden' : 'flex'}`}>
                  👤
                </div>
              </div>
              <p className={`${menuOpen?("ml-0 opacity-100"):("-ml-14 opacity-0")} transition-margin transition-opacity duration-500 ease-in-out`}>
                Profile
              </p>
            </div>
            
            {profileDropdown && (
              <div className="absolute bottom-full left-20 mb-2 bg-[#1a1a1a] border border-gray-600 rounded-lg shadow-lg min-w-[200px] z-50">
                <div className="p-3 border-b border-gray-600">
                  <p className="text-white font-semibold">{userProfile?.username || 'User'}</p>
                  <p className="text-gray-400 text-sm">{userProfile?.email}</p>
                </div>
                <ul className="py-2">
                  <li>
                    <button 
                      onClick={() => {changeURL('/profile'); setProfileDropdown(false);}} 
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center gap-3"
                    >
                      <ion-icon name="person"></ion-icon>
                      My Profile
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => {changeURL('/wishlist'); setProfileDropdown(false);}} 
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center gap-3"
                    >
                      <ion-icon name="bookmark"></ion-icon>
                      Wishlist
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => {logout1(); setProfileDropdown(false);}} 
                      className="w-full text-left px-4 py-2 hover:bg-red-600 text-gray-300 hover:text-white flex items-center gap-3"
                    >
                      <ion-icon name="log-out"></ion-icon>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            <li>
              <Link to='/login' className="flex gap-5 hover:text-white">
                <p className="  w-[100px] text-center">
                  <ion-icon name="log-in"></ion-icon>
                </p>
                <p className={`  ${menuOpen?("ml-0 opacity-100"):("-ml-14 opacity-0")}  transition-margin transition-opacity duration-500 ease-in-out`}>Login</p>
              </Link>
            </li>
            <li>
              <Link to='/signup' className="flex gap-5 hover:text-white">
                <p className="  w-[100px] text-center">
                  <ion-icon name="person-add"></ion-icon>
                </p>
                <p className={`  ${menuOpen?("ml-0 opacity-100"):("-ml-14 opacity-0")}  transition-margin transition-opacity duration-500 ease-in-out`}>Register</p>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
    {profileDropdown && (
      <div 
        className="fixed inset-0 z-30" 
        onClick={() => setProfileDropdown(false)}
      ></div>
    )}
    </nav>
  );
};

export default Nav;
