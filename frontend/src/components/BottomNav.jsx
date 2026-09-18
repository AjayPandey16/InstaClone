import React from 'react';
import { RiHome5Line } from 'react-icons/ri';
import { FiSearch } from 'react-icons/fi';
import { FaRegHeart, FaRegUser, FaRegPlusSquare } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';



const BottomNav = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const navClass = ({ isActive }) => `icon-button h-11 w-11 cursor-pointer text-[22px] ${isActive ? 'bg-white/10 text-pink-300' : 'text-gray-300'}`;

  return (
    <>
      <div className="bottomNav-spacer" aria-hidden="true" />
      <footer className="bottomNav fixed bottom-0 left-0 right-0 z-50 mx-auto flex w-full items-center justify-around border-t border-white/10 bg-[#0d0e11]/90 px-4 backdrop-blur-xl md:bottom-4 md:max-w-md md:rounded-full md:border" aria-label="Main navigation">
        <NavLink to="/" className={navClass} aria-label="Home" title="Home"><RiHome5Line /></NavLink>
        <NavLink to="/search" className={navClass} aria-label="Search" title="Search"><FiSearch /></NavLink>
        <button type="button" className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-pink-400 text-[22px] text-black shadow-lg shadow-pink-400/20 transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink-300' onClick={() => navigate('/create')} aria-label="Create post" title="Create post"><FaRegPlusSquare /></button>
        <NavLink to="/notifications" className={navClass} aria-label="Notifications" title="Notifications"><FaRegHeart /></NavLink>
        <NavLink to={userId ? `/profile/${userId}` : '/login'} className={navClass} aria-label="Profile" title="Profile"><FaRegUser /></NavLink>
      </footer>
    </>
  )
}

export default BottomNav