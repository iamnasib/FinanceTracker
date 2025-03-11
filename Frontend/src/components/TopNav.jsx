import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Menu, X} from "lucide-react";

const TopNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className='h-16 sm:h-20' />
      <nav className='fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md shadow-md'>
        <div className='flex items-center justify-between border-b border-slate-200 p-4'>
          <Link to='/' className='flex items-center gap-2'>
            <img src='/logo.svg' alt='Logo' className='h-6 sm:h-9' />
            <span className='text-lg uppercase font-semibold'>trance</span>
          </Link>
          <div className='sm:hidden'>
            <button
              onClick={toggleNavbar}
              className='text-slate-900 focus:outline-none'>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
          {/* Larger screen's menu */}
          <div className='hidden sm:flex gap-4'>
            <Link
              to='/login'
              className='px-5 py-2.5 bg-slate-900 text-slate-50 text-sm uppercase tracking-wide rounded-full font-medium hover:bg-black focus:outline-none focus:ring-4 focus:ring-slate-200'>
              Login
            </Link>
            <Link
              to='/signup'
              className='px-5 py-2.5 bg-slate-900 text-slate-50 text-sm uppercase tracking-wide rounded-full font-medium hover:bg-black focus:outline-none focus:ring-4 focus:ring-slate-200'>
              Signup
            </Link>
          </div>
        </div>
        {/* Mobile menu */}
        {isOpen && (
          <div className='sm:hidden flex flex-col space-y-4 p-4 border-b border-slate-200 transition-all duration-500'>
            <Link
              to='/login'
              onClick={() => setIsOpen(false)}
              className='flex justify-center px-5 py-2.5 bg-slate-900 text-slate-50 text-sm uppercase tracking-wide rounded-full font-medium hover:bg-black focus:outline-none focus:ring-4 focus:ring-slate-200'>
              Login
            </Link>
            <Link
              to='/signup'
              onClick={() => setIsOpen(false)}
              className='flex justify-center px-5 py-2.5 bg-slate-900 text-slate-50 text-sm uppercase tracking-wide rounded-full font-medium hover:bg-black focus:outline-none focus:ring-4 focus:ring-slate-200'>
              Signup
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default TopNav;
