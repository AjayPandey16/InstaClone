import React, { useState } from 'react'
import logo from '../images/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api_base_url } from '../helper';


const Login = () => {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    fetch(api_base_url + "/login", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        pwd: password
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        navigate("/");
      }
      else {
        toast.error(data.msg)
      }
    })
  }

  return (
    <>
      <div className='con flex min-h-screen items-center justify-center flex-col bg-black px-4'>
        <form onSubmit={submitForm} className='w-full max-w-[350px] flex flex-col items-center justify-center'>
          <img className='w-[150px] object-cover' src={logo} alt='' />


          <div className='inputBox'>
            <input onChange={(e) => { setEmail(e.target.value) }} value={email} type='email' placeholder='Email' required />
          </div>

          <div className='inputBox'>
            <input onChange={(e) => { setPassword(e.target.value) }} value={password} type='password' placeholder='Password' required />
          </div>

          <p className='text-[14px] text-gray-100 self-start'> Don't have an account
            <Link to="/signUp" className='text-[#3797EF]'> Sign Up</Link></p>

          <button className='btnNormal w-full mt-4' type='submit'> Login </button>
        </form>
      </div>
    </>
  );
}

export default Login;