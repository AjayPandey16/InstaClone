import React, { useState } from 'react';
import logo from '../images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiJson } from '../api';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const submitForm = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            setIsSubmitting(true);
            await apiJson('/signUp', {
                username: username.trim(),
                name: name.trim(),
                email: email.trim(),
                pwd: password,
            });
            toast.success('Account created successfully');
            navigate('/login');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className='w-full min-h-screen flex flex-col justify-center items-center bg-black gap-6 px-4'>
                <form onSubmit={submitForm} className='flex w-full max-w-87.5 flex-col gap-4 bg-gray-900 p-6 rounded-lg shadow-lg'>
                    <img className='mx-auto w-37.5 object-cover' src={logo} alt='' />

                    <div className='inputBox'>
                        <input onChange={(e) => { setUsername(e.target.value) }} value={username} type='text' placeholder='Username' required />
                    </div>

                    <div className='inputBox'>
                        <input onChange={(e) => { setName(e.target.value) }} value={name} type='text' placeholder='Name' required />
                    </div>

                    <div className='inputBox'>
                        <input onChange={(e) => { setEmail(e.target.value) }} value={email} type='email' placeholder='Email' required />
                    </div>

                    <div className='inputBox'>
                        <input onChange={(e) => { setPassword(e.target.value) }} value={password} type='password' placeholder='Password' minLength='6' required />
                    </div>

                    <p className='text-[14px] text-gray-100 self-start'> Already have an account
                        <Link to="/login" className='text-[#3797EF]'> Login</Link></p>

                    <button className='btnNormal mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60' type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </>
    )
}

export default SignUp
    