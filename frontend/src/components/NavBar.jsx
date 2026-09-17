import React from 'react';
import logo from '../images/logo.png';
import { FaHeart } from 'react-icons/fa';
import { AiOutlineMessage } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const navigate = useNavigate();
    return (
        <>
        <div className="nav flex w-full items-center justify-between p-2.5 py-5">
            <img className='w-25 object-cover' src={logo} alt='' />
            <div className='flex items-center gap-3.75'>
                <button type="button" className='cursor-pointer text-[22px]' onClick={() => navigate('/notifications')} aria-label="Notifications"><FaHeart /></button>
                <button type="button" className='cursor-pointer text-[22px]' onClick={() => navigate('/messages')} aria-label="Messages"><AiOutlineMessage /></button>
            </div>
        </div>
        </>
    );
}

export default NavBar;
