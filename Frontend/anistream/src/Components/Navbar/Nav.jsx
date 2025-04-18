import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../Assets/icon.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { setResults } from "../../Redux/local_data_Slice";
import { logout } from "../../Redux/userSlice";
const { VITE_BACKEND_LINK } = import.meta.env;
const Nav = () => {
  const location = useLocation();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  let [isLoggedIn, setLoggedIn] = useState(null);
  let [query, setQuery] = useState("");
  let [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    async function ab() {
      let response = await axios.get(`${VITE_BACKEND_LINK}/verify_token`, {
        withCredentials: true,
      });
      response = response.data;
      console.log(response);
      setLoggedIn(response);
    }
    ab();
  }, [user]);

  function changeURL(l) {
    navigate(l);
  }
  async function logout1() {
    let response = await axios.get(`${VITE_BACKEND_LINK}/logout`, {
      withCredentials: true,
    });
    response = response.data.bool;
    if (response) {
      setLoggedIn(null);
      dispatch(logout());
    }
  }
  async function search() {
    let results = await axios.get(`${VITE_BACKEND_LINK}/search/${query}`);
    if (results.data.bool) {
      dispatch(setResults(results.data.results));
      navigate("/results");
    } else {
      toast.warning("Something went wrong", { position: "bottom-right" });
    }
  }
  return (
    // <div className="bg-[#404040]/60 flex w-full items-center fixed top-0 h-[10vh] overflow-y-visible z-50 gap-8 px-2">
    //   <div className="flex gap-2 w-[35%] justify-center items-center">
    //     <img className="h-16" src={logo} alt="Icon" />
    //     <p className="font-extrabold m-0 text-3xl text-white w-fit h-fit">
    //       Anistream
    //     </p>
    //   </div>
    //   <div className={`flex h-full w-full justify-center items-center gap-3`}>
    //     <div className={(location.pathname=="/"?"bg-[#80002091] border-[3px] h-[115%] rounded-b-md border-black":"h-full")+`   hover:h-[115%] hover:rounded-b-md hover:border-black hover:bg-[rgba(88,85,255,0.46)] text-white text-lg font-semibold flex w-[15%]   z-50 justify-center items-center`}>
    //       <button onClick={()=>changeURL("/")}>Home</button>
    //     </div>
    //     {/* <div className={(location.pathname=="/genre"?"bg-[#800020] border-[3px] h-[115%] rounded-b-md border-black":"h-full")+`   hover:h-[115%] hover:rounded-b-md hover:border-black text-white text-lg font-semibold flex w-[15%] z-50 justify-center items-center`}>
    //       <button onClick={()=>changeURL("/genre")}>Genre</button>
    //     </div> */}
    //     {
    //       isLoggedIn && isLoggedIn.bool && isLoggedIn.type=="admin"?(
    //         <div className={(location.pathname=="/new"?"bg-[#800020] border-[3px] h-[115%] rounded-b-md border-black":"h-full")+`   hover:h-[115%] hover:rounded-b-md hover:border-black hover:bg-[rgba(88,85,255,0.46)] text-white text-lg font-semibold flex w-[15%]  z-50 justify-center items-center`}>
    //       <button onClick={()=>changeURL("/upload")}>New</button>
    //     </div>
    //       ):(<span></span>)
    //     }
    //     {
    //       isLoggedIn && isLoggedIn.bool?
    //      ( <div className={(location.pathname=="/wishlist"?"bg-[#800020] border-[3px] h-[115%] rounded-b-md border-black":"h-full")+`   hover:h-[115%] hover:rounded-b-md hover:border-black hover:bg-[rgba(88,85,255,0.46)] text-white text-lg font-semibold flex w-[15%] z-50 justify-center items-center`}>
    //       <button onClick={()=>changeURL("/wishlist")} className="text-xl text-blue-300">
    //         <ion-icon name="bookmark"></ion-icon>
    //       </button>
    //     </div>):(<span></span>)
    //     }
    //   </div>
    //   <div className={`flex gap-5 w-[20%] items-center `}>
    //     <form
    //       className="flex w-full justify-center items-center"
    //       action=""
    //     >
    //       <input
    //         onChange={(e) => setQuery(e.target.value)}
    //         placeholder="Search..."
    //         className="outline-none border-black border-b-[3px] text-lg py-2 pr-9 w-full text-white bg-transparent "
    //         type="text"
    //       />
    //       <button
    //         type="button"
    //         onClick={() => search()}
    //         className="flex text-2xl   bg-white rounded-full w-fit h-fit -ml-7 bg-transparent items-center "
    //       >
    //         <ion-icon name="arrow-forward"></ion-icon>
    //       </button>
    //     </form>
    //   </div>
    //   {
    //     isLoggedIn && isLoggedIn.bool?(

    //       <button className="text-white font-arial bg-[#113253] w-[30%] hover:bg-[#001F3F]  py-2 flex  justify-center items-center font-semibold"
    //       onClick={logout1}>Logout</button>
    //     ):(

    //       <div className="flex gap-1 w-[30%]">
    //       <Link
    //       to="/login"
    //       className="text-white font-arial bg-[#113253] w-[50%] hover:bg-[#001F3F]  py-2 flex  justify-center items-center font-semibold"
    //       >
    //       Login
    //       </Link>
    //       <Link
    //       to="/signup"
    //       className="text-white font-arial flex bg-[#541a15] w-[50%] hover:bg-[#420D09] py-2 justify-center items-center font-semibold"
    //       >
    //       Signup
    //       </Link>
    //       </div>
    //     )
    //   }
    // </div>
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
            <button onClick={()=>changeURL("/genre")} >
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
            user && user.type==="admin"?(
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
      <div className="text-2xl flex text-[#8f8f8f]">
        {isLoggedIn && isLoggedIn.bool ? (
          <ul>
            <li onClick={logout1}>
              <div className="flex gap-5 hover:text-white">
                <p className="  w-[100px] text-center">
                  <ion-icon name="log-out"></ion-icon>
                </p>
                <p className={`  ${menuOpen?("ml-0 opacity-100"):("-ml-14 opacity-0")}  transition-margin transition-opacity duration-500 ease-in-out`}>Logout</p>
              </div>
            </li>
          </ul>
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
    </nav>
  );
};

export default Nav;
