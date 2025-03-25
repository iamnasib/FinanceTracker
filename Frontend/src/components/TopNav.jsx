import React, {useContext, useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {Menu, X} from "lucide-react";
import {Button} from "./ui/button";
import AuthContext from "@/context/auth/AuthContext";

const TopNav = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const {isAuthenticated} = authContext;
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
          {!isLoggedIn && (
            <div className='hidden sm:flex gap-4 items-center'>
              <Button className='cursor-pointer'>
                <Link to='/login'>Login</Link>
              </Button>
              <Button className='cursor-pointer'>
                <Link to='/signup'>Signup</Link>
              </Button>
            </div>
          )}
        </div>
        {/* Mobile menu */}
        {!isLoggedIn && isOpen && (
          <div className='sm:hidden flex flex-col space-y-4 p-4 border-b border-slate-200 transition-all duration-500'>
            <Button
              onClick={() => setIsOpen(false)}
              className='w-full cursor-pointer'>
              <Link to='/login'>Login</Link>
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className='w-full cursor-pointer'>
              <Link to='/signup'>Signup</Link>
            </Button>
          </div>
        )}
      </nav>
    </>
  );
};

export default TopNav;
