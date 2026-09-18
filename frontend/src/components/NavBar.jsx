import React from 'react';
import logo from '../images/logo.png';
import { FaHeart } from 'react-icons/fa';
import { AiOutlineMessage } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const navigate = useNavigate();
    return (
        <>
        <div className="nav flex w-full items-center justify-between border-b border-white/10 px-4 py-4 md:px-8">
            <div>
                <img className='w-25 object-cover' src={logo} alt='InstaClone' />
                <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-gray-500">Share your world</p>
            </div>
            <div className='flex items-center gap-1'>
                <button type="button" className='icon-button h-10 w-10 cursor-pointer text-[20px]' onClick={() => navigate('/notifications')} aria-label="Notifications"><FaHeart /></button>
                <button type="button" className='icon-button h-10 w-10 cursor-pointer text-[22px]' onClick={() => navigate('/messages')} aria-label="Messages"><AiOutlineMessage /></button>
            </div>
        </div>
        </>
    );
}

export default NavBar;
