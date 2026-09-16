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
                <i className='cursor-pointer text-[22px]' onClick={() => navigate('/notifications')}> <FaHeart /> </i>
                <i className='cursor-pointer text-[22px]' onClick={() => navigate('/messages')} title='Messages'> <AiOutlineMessage /> </i>
            </div>
        </div>
        </>
    );
}

export default NavBar;
