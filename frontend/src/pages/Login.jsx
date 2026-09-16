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
      <div className='con flex min-h-screen items-center justify-center flex-col bg-black px-4'>
        <form onSubmit={submitForm} className='w-full max-w-87.5 flex flex-col items-center justify-center'>
          <img className='w-37.5 object-cover' src={logo} alt='' />


          <div className='inputBox'>
            <input onChange={(e) => { setEmail(e.target.value) }} value={email} type='email' placeholder='Email' required />
          </div>

          <div className='inputBox'>
            <input onChange={(e) => { setPassword(e.target.value) }} value={password} type='password' placeholder='Password' required />
          </div>

          <p className='text-[14px] text-gray-100 self-start'> Don't have an account
            <Link to="/signUp" className='text-[#3797EF]'> Sign Up</Link></p>

          <button className='btnNormal mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;