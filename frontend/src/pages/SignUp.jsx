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
            <div className='w-full min-h-screen flex flex-col justify-center items-center bg-[#08090b] gap-6 px-4 py-10'>
                <form onSubmit={submitForm} className='flex w-full max-w-md flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-pink-950/20 backdrop-blur-xl sm:p-10'>
                    <img className='mx-auto w-37.5 object-cover' src={logo} alt='InstaClone' />
                    <p className='mb-4 text-center text-sm text-gray-400'>Create a little corner of the internet that feels like yours.</p>

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

                    <p className='text-[14px] text-gray-400 self-start'> Already have an account
                        <Link to="/login" className='font-semibold text-pink-300 transition hover:text-pink-200'> Login</Link></p>

                    <button className='btnNormal mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60' type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </>
    )
}

export default SignUp
    