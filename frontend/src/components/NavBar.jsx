import React from 'react';
import logo from '../images/logo.png';
import { FaHeart } from 'react-icons/fa';
import { AiOutlineMessage } from 'react-icons/ai';

const NavBar = () => {
    return (
        <>
        <div className="nav flex w-full items-center justify-between p-2.5 py-5">
            <img className='w-[100px] object-cover' src={logo} alt='' />
            <div className='flex items-center gap-3.75'>
                <i className='cursor-pointer text-[22px]'> <FaHeart /> </i>
                <i className='cursor-pointer text-[22px]'> <AiOutlineMessage /> </i>
            </div>
        </div>
        </>
    );
}

export default NavBar;
