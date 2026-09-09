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
      <div className="bottomNav fixed bottom-0 left-0 right-0 z-50 flex h-[56px] w-full items-center justify-between border-t border-[#27272a] bg-[#121212]/95 px-4 backdrop-blur-sm">
        <i className='text-[23px] cursor-pointer' onClick={() => { navigate("/") }}><RiHome5Line /></i>
        <i className='text-[23px] cursor-pointer' onClick={() => { navigate("/search") }}><FiSearch /></i>
        <i className='text-[23px] cursor-pointer' onClick={() => { navigate("/create") }}><FaRegPlusSquare /></i>
        <i className='text-[23px] cursor-pointer'><FaRegHeart /></i>
        <i className='text-[23px] cursor-pointer' onClick={() => {
          if (userId) {
            navigate("/profile/" + userId);
          } else {
            navigate("/login");
          }
        }}><FaRegUser /></i>
      </div>
    </>
  )
}

export default BottomNav