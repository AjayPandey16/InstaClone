import React from 'react';
import { RiHome5Line } from 'react-icons/ri';
import { FiSearch } from 'react-icons/fi';
import { FaRegHeart, FaRegUser, FaRegPlusSquare } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';



const BottomNav = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  return (
    <>
      <div className="bottomNav fixed bottom-0 left-0 right-0 z-50 flex h-14 w-full items-center justify-between border-t border-[#27272a] bg-[#121212]/95 px-4 backdrop-blur-sm">
        <button type="button" className='cursor-pointer text-[23px]' onClick={() => navigate('/')} aria-label="Home"><RiHome5Line /></button>
        <button type="button" className='cursor-pointer text-[23px]' onClick={() => navigate('/search')} aria-label="Search"><FiSearch /></button>
        <button type="button" className='cursor-pointer text-[23px]' onClick={() => navigate('/create')} aria-label="Create post"><FaRegPlusSquare /></button>
        <button type="button" className='cursor-pointer text-[23px]' onClick={() => navigate('/notifications')} aria-label="Notifications"><FaRegHeart /></button>
        <button type="button" className='cursor-pointer text-[23px]' onClick={() => {
          if (userId) {
            navigate('/profile/' + userId);
          } else {
            navigate('/login');
          }
        }} aria-label="Profile"><FaRegUser /></button>
      </div>
    </>
  )
}

export default BottomNav