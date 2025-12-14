import React from 'react';
import logo from '../images/logo.png';
import { FaHeart } from 'react-icons/fa';
import { AiOutlineMessage } from 'react-icons/ai';

const NavBar = () => {
    return (
        <>
        <div className="nav p-[10px] py-[20px] flex items-center justify-between">
    <img className='w-[100px] object-cover' src={logo} alt='' />
        </div>

        <div className='flex items-center gap-[15px]'>
            <i className='text-[22px] cursor-pointer'> <FaHeart /> </i>
            <i className='text-[22px] cursor-pointer'> <AiOutlineMessage /> </i>
        </div>
        </>
    );
}

export default NavBar;
