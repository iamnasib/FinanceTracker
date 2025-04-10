import React, {useContext, useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Menu, X} from "lucide-react";
import {Button} from "./ui/button";
import AuthContext from "@/context/auth/AuthContext";

const TopNav = (props) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const {isAuthenticated, logout} = authContext;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoggedIn(await isAuthenticated());
    };
    checkAuth();
  }, [isAuthenticated]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className='h-16 sm:h-20' />
      <nav className='fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg shadow-md'>
        <div className='flex items-center justify-between border-b border-slate-200 p-4'>
          <Link to='/' className='flex items-center gap-2'>
            <img src='/logo.svg' alt='Logo' className='h-6 sm:h-9' />
            <span className='text-lg uppercase font-semibold'>
              {props.appName}
            </span>
          </Link>
          <div className='sm:hidden'>
            <button
              onClick={toggleNavbar}
              className='text-slate-900 focus:outline-none cursor-pointer'>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
          {/* Larger screen's menu */}

          <div className='hidden sm:flex gap-4 items-center'>
            {!isLoggedIn ? (
              <>
                <Link to='/login'>
                  <Button className='cursor-pointer'>Login</Button>
                </Link>
                <Link to='/signup'>
                  <Button className='cursor-pointer'>Signup</Button>
                </Link>
              </>
            ) : (
              <Button
                className='cursor-pointer bg-red-600 hover:bg-red-700 transition-all'
                onClick={() => {
                  logout(navigate);
                }}>
                Logout
              </Button>
            )}
          </div>
        </div>
        {/* Mobile menu */}
        {isOpen && (
          <div className='sm:hidden flex flex-col space-y-4 p-4 border-b border-slate-200 transition-all duration-500'>
            {!isLoggedIn ? (
              <>
                <Link to='/login'>
                  <Button
                    onClick={() => setIsOpen(false)}
                    className='w-full cursor-pointer'>
                    Login
                  </Button>
                </Link>
                <Link to='/signup'>
                  <Button
                    onClick={() => setIsOpen(false)}
                    className='w-full cursor-pointer'>
                    Signup
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                className='cursor-pointer'
                onClick={() => {
                  logout(navigate);
                  setIsOpen(!isOpen);
                }}>
                Logout
              </Button>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default TopNav;
