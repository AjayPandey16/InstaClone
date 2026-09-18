import React, { useState } from 'react';
import logo from '../images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiJson } from '../api';


const Login = () => {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = await apiJson('/login', { email: email.trim(), pwd: password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className='con flex min-h-screen items-center justify-center flex-col bg-[#08090b] px-4 py-10'>
        <form onSubmit={submitForm} className='w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-pink-950/20 backdrop-blur-xl sm:p-10'>
          <img className='mx-auto w-37.5 object-cover' src={logo} alt='InstaClone' />
          <p className='mb-8 mt-3 text-center text-sm text-gray-400'>Your people, your moments, one place.</p>


          <div className='inputBox'>
            <input onChange={(e) => { setEmail(e.target.value) }} value={email} type='email' placeholder='Email' required />
          </div>

          <div className='inputBox'>
            <input onChange={(e) => { setPassword(e.target.value) }} value={password} type='password' placeholder='Password' required />
          </div>

          <p className='text-[14px] text-gray-400 self-start'> Don't have an account
            <Link to="/signUp" className='font-semibold text-pink-300 transition hover:text-pink-200'> Sign Up</Link></p>

          <button className='btnNormal mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;