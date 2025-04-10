import React from "react";
import {cn} from "../lib/utils";
import {CreditCard, Home, User, Plus, BarChart2} from "lucide-react";
import {Link} from "react-router-dom";

const NavItem = ({icon, label, href, isActive, isPrimary}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex flex-col items-center justify-center space-y-1",
        isActive ? "text-slate-950" : "text-slate-500",
        isPrimary ? "relative -top-5" : ""
      )}>
      <div
        className={cn(
          "flex items-center justify-center",
          isPrimary ? "rounded-full bg-slate-950 p-3.5 text-slate-50" : ""
        )}>
        {icon}
      </div>
      <span className='text-xs font-medium'>{label}</span>
    </Link>
  );
};

const BottomNav = () => {
  return (
    <>
      <div className='h-16 sm:h-20' />
      <div className='fixed bottom-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl'>
        <div className='mx-auto '>
          <div className='flex items-center justify-between border-t border-t-slate-200 p-2 px-4 '>
            <NavItem icon={<Home size={20} />} label='Home' href='/' isActive />
            <NavItem
              icon={<CreditCard size={20} />}
              label='Card'
              href='/card'
            />

            <NavItem
              icon={<BarChart2 size={20} />}
              label='Accounts'
              href='/accounts'
            />
            <NavItem
              icon={<User size={20} />}
              label='Profile'
              href='/profile'
            />
          </div>
          {/* <div className='mx-auto mb-1 h-1 w-1/3 rounded-full bg-slate-200' /> */}
        </div>
      </div>
    </>
  );
};

export default BottomNav;
